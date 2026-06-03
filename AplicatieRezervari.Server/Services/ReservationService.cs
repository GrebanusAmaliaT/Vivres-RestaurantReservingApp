using AplicatieRezervari.Server.DTOs;
using AplicatieRezervari.Server.Models;
using AplicatieRezervari.Server.Repositories;

namespace AplicatieRezervari.Server.Services
{
    public class ReservationService : IReservationService
    {
        private readonly IReservationRepository _reservationRepository;
        private readonly IRestaurantRepository _restaurantRepository;
        private readonly ILogger<ReservationService> _logger;

        private static readonly string[] AllowedStatuses =
        {
            "Pending",
            "Confirmed",
            "Rejected",
            "Cancelled"
        };

        public ReservationService(
            IReservationRepository reservationRepository,
            IRestaurantRepository restaurantRepository,
            ILogger<ReservationService> logger)
        {
            _reservationRepository = reservationRepository;
            _restaurantRepository = restaurantRepository;
            _logger = logger;
        }

        public async Task<ReservationDto> CreateReservationAsync(CreateReservationDto dto, string userId)
        {
            var restaurant = await _restaurantRepository.GetRestaurantByIdAsync(dto.RestaurantId);

            if (restaurant == null)
            {
                throw new KeyNotFoundException("Restaurantul nu a fost gasit.");
            }

            if (dto.ReservationDate <= DateTime.Now)
            {
                throw new ArgumentException("Data si ora rezervarii trebuie sa fie in viitor.");
            }

            if (dto.NumberOfPeople <= 0)
            {
                throw new ArgumentException("Numarul de persoane trebuie sa fie valid.");
            }

            if (dto.NumberOfPeople > restaurant.Capacity)
            {
                throw new ArgumentException("Numarul de persoane depaseste capacitatea restaurantului.");
            }

            if (dto.IsEvent)
            {
                return await HandleEventReservationAsync(dto, restaurant, userId);
            }

            return await HandleRegularReservationAsync(dto, restaurant, userId);
        }

        private async Task<ReservationDto> HandleEventReservationAsync(
            CreateReservationDto dto,
            Restaurant restaurant,
            string userId)
        {
            if (!restaurant.AcceptsEvents)
            {
                throw new ArgumentException("Acest restaurant nu accepta evenimente speciale.");
            }

            if (!dto.EventTypeId.HasValue)
            {
                throw new ArgumentException("Trebuie selectat tipul evenimentului.");
            }

            var eventOption = restaurant.EventOptions
                .FirstOrDefault(e =>
                    e.EventTypeId == dto.EventTypeId.Value &&
                    e.IsEnabled);

            if (eventOption == null)
            {
                throw new ArgumentException("Restaurantul nu organizeaza acest tip de eveniment.");
            }

            var hasConfirmedReservationOnSameDay = HasConfirmedReservationOnSameDay(
                restaurant,
                dto.ReservationDate
            );

            if (hasConfirmedReservationOnSameDay)
            {
                throw new ArgumentException("Restaurantul are deja o rezervare confirmata in acea zi.");
            }

            var selectedMenus = dto.MenuSelections
                .Where(selection => selection.Quantity > 0)
                .ToList();

            if (!selectedMenus.Any())
            {
                throw new ArgumentException("Trebuie selectat cel putin un meniu pentru eveniment.");
            }

            var availableMenus = eventOption.MenuOptions
                .Where(menu => menu.IsEnabled)
                .ToList();

            int totalPeople = selectedMenus.Sum(selection => selection.Quantity);

            if (totalPeople < eventOption.MinPeople)
            {
                throw new ArgumentException($"Numarul minim de persoane pentru acest eveniment este {eventOption.MinPeople}.");
            }

            if (eventOption.MaxPeople.HasValue && totalPeople > eventOption.MaxPeople.Value)
            {
                throw new ArgumentException($"Numarul maxim de persoane pentru acest eveniment este {eventOption.MaxPeople.Value}.");
            }

            if (totalPeople > restaurant.Capacity)
            {
                throw new ArgumentException("Numarul de persoane depaseste capacitatea restaurantului.");
            }

            decimal estimatedTotal = 0;

            var reservation = new Reservation
            {
                Id = Guid.NewGuid(),
                RestaurantId = restaurant.Id,
                UserId = userId,
                ReservationDate = dto.ReservationDate,
                NumberOfPeople = totalPeople,
                SpecialRequests = dto.SpecialRequests,
                Status = "Pending",
                CreatedAt = DateTime.UtcNow,

                Type = ReservationType.Event,

                EventTypeId = eventOption.EventTypeId,
                EventMenuType = eventOption.EventType.Name,

                RestaurantTableId = null
            };

            foreach (var selectedMenu in selectedMenus)
            {
                var menu = availableMenus.FirstOrDefault(m =>
                    m.Id == selectedMenu.RestaurantEventMenuOptionId);

                if (menu == null)
                {
                    throw new ArgumentException("Unul dintre meniurile selectate nu este disponibil pentru acest restaurant.");
                }

                estimatedTotal += menu.PricePerPerson * selectedMenu.Quantity;

                reservation.EventMenuSelections.Add(new ReservationEventMenuSelection
                {
                    Id = Guid.NewGuid(),
                    RestaurantEventMenuOptionId = menu.Id,
                    Quantity = selectedMenu.Quantity,
                    PricePerPersonAtRequest = menu.PricePerPerson,
                    MenuNameSnapshot = menu.MenuType.Name
                });
            }

            reservation.EstimatedTotalCost = estimatedTotal;

            var result = await _reservationRepository.CreateAsync(reservation);

            return MapToDto(result, restaurant);

        }
        private async Task<ReservationDto> HandleRegularReservationAsync(
            CreateReservationDto dto,
            Restaurant restaurant,
            string userId)
        {
            var reservationTime = dto.ReservationDate.TimeOfDay;
            var requestedStart = dto.ReservationDate;
            var requestedEnd = requestedStart.AddHours(restaurant.DefaultReservationDurationInHours);


            if (reservationTime < restaurant.OpeningTime)
            {
                throw new ArgumentException("Restaurantul este inchis la ora selectata.");
            }

            if (requestedEnd.TimeOfDay > restaurant.ClosingTime)
            {
                throw new ArgumentException("Rezervarea depaseste ora de inchidere a restaurantului.");
            }

            if (restaurant.Tables == null || !restaurant.Tables.Any())
            {
                throw new ArgumentException("Restaurantul nu are mese configurate.");
            }

            var availableTable = restaurant.Tables
                .Where(t => t.Capacity >= dto.NumberOfPeople)
                .OrderBy(t => t.Capacity)
                .FirstOrDefault(t => IsTableAvailable(
                    t,
                    requestedStart,
                    requestedEnd,
                    restaurant.DefaultReservationDurationInHours,
                    null
                ));

            if (availableTable == null)
            {
                throw new ArgumentException("Nu exista mese disponibile pentru ora si numarul de persoane selectate.");
            }

            var reservation = new Reservation
            {
                Id = Guid.NewGuid(),
                RestaurantId = restaurant.Id,
                UserId = userId,
                ReservationDate = dto.ReservationDate,
                NumberOfPeople = dto.NumberOfPeople,
                SpecialRequests = dto.SpecialRequests,
                Status = "Pending",
                CreatedAt = DateTime.UtcNow,
                Type = ReservationType.Regular,
                RestaurantTableId = availableTable.Id,
                EstimatedTotalCost = 0
            };

            var result = await _reservationRepository.CreateAsync(reservation);

            _logger.LogInformation(
                "Regular reservation {ReservationId} created as Pending for table {TableId}",
                result.Id,
                availableTable.Id
            );

            return MapToDto(result, restaurant);
        }

        public async Task<IEnumerable<ReservationDto>> GetClientReservationsAsync(string userId)
        {
            var list = await _reservationRepository.GetByUserIdAsync(userId);

            return list.Select(r => MapToDto(r, r.Restaurant));
        }

        public async Task<IEnumerable<ReservationDto>> GetManagerReservationsAsync(string managerId)
        {
            var list = await _reservationRepository.GetByRestaurantManagerIdAsync(managerId);

            return list.Select(r => MapToDto(r, r.Restaurant));
        }

        public async Task<bool> UpdateStatusAsync(Guid reservationId, string status, string managerId)
        {
            if (!AllowedStatuses.Contains(status))
            {
                _logger.LogWarning("Invalid reservation status: {Status}", status);
                return false;
            }

            var reservation = await _reservationRepository.GetByIdAsync(reservationId);

            if (reservation == null)
            {
                return false;
            }

            if (reservation.Restaurant.ManagerId != managerId)
            {
                _logger.LogWarning(
                    "Unauthorized status change attempt by manager {ManagerId}",
                    managerId
                );

                return false;
            }

            if (reservation.Status != "Pending" && status == "Confirmed")
            {
                _logger.LogWarning(
                    "Only pending reservations can be confirmed. Reservation {ReservationId} has status {Status}",
                    reservationId,
                    reservation.Status
                );

                return false;
            }

            if (status == "Confirmed")
            {
                var canConfirm = CanConfirmReservation(reservation);

                if (!canConfirm)
                {
                    _logger.LogWarning(
                        "Reservation {ReservationId} cannot be confirmed because the slot is no longer available.",
                        reservationId
                    );

                    return false;
                }
            }

            reservation.Status = status;

            await _reservationRepository.UpdateAsync(reservation);

            _logger.LogInformation(
                "Reservation {ReservationId} status updated to {Status}",
                reservationId,
                status
            );

            return true;
        }

        private static bool CanConfirmReservation(Reservation reservation)
        {
            var restaurant = reservation.Restaurant;

            if (reservation.Type == ReservationType.Event)
            {
                return !HasConfirmedReservationOnSameDay(
                    restaurant,
                    reservation.ReservationDate,
                    reservation.Id
                );
            }

            if (reservation.RestaurantTable == null)
            {
                return false;
            }

            var requestedStart = reservation.ReservationDate;
            var requestedEnd = requestedStart.AddHours(restaurant.DefaultReservationDurationInHours);

            return IsTableAvailable(
                reservation.RestaurantTable,
                requestedStart,
                requestedEnd,
                restaurant.DefaultReservationDurationInHours,
                reservation.Id
            );
        }

        private static bool HasConfirmedReservationOnSameDay(
            Restaurant restaurant,
            DateTime reservationDate,
            Guid? ignoredReservationId = null)
        {
            var reservationsFromRestaurant = restaurant.Reservations ?? new List<Reservation>();

            var reservationsFromTables = restaurant.Tables?
                .SelectMany(t => t.Reservations ?? new List<Reservation>())
                .ToList() ?? new List<Reservation>();

            return reservationsFromRestaurant
                .Concat(reservationsFromTables)
                .Any(r =>
                    r.Status == "Confirmed" &&
                    r.ReservationDate.Date == reservationDate.Date &&
                    (!ignoredReservationId.HasValue || r.Id != ignoredReservationId.Value)
                );
        }

        private static bool IsTableAvailable(
            RestaurantTable table,
            DateTime requestedStart,
            DateTime requestedEnd,
            double durationInHours,
            Guid? ignoredReservationId)
        {
            return !table.Reservations.Any(r =>
                r.Status == "Confirmed" &&
                (!ignoredReservationId.HasValue || r.Id != ignoredReservationId.Value) &&
                ReservationsOverlap(
                    requestedStart,
                    requestedEnd,
                    r.ReservationDate,
                    r.ReservationDate.AddHours(durationInHours)
                )
            );
        }

        private static bool ReservationsOverlap(
            DateTime start1,
            DateTime end1,
            DateTime start2,
            DateTime end2)
        {
            return start1 < end2 && end1 > start2;
        }

        private static ReservationDto MapToDto(Reservation reservation, Restaurant restaurant)
        {
            return new ReservationDto
            {
                Id = reservation.Id,
                RestaurantId = restaurant.Id,
                RestaurantTableId = reservation.RestaurantTableId,
                ReservationDate = reservation.ReservationDate,
                NumberOfPeople = reservation.NumberOfPeople,
                SpecialRequests = reservation.SpecialRequests,
                Status = reservation.Status,
                Type = reservation.Type.ToString(),
                EventMenuType = reservation.EventMenuType,
                RestaurantName = restaurant.Name,
                RestaurantAddress = restaurant.Address,
                UserEmail = reservation.User?.Email ?? string.Empty,
                EstimatedTotalCost = reservation.EstimatedTotalCost,
                CreatedAt = reservation.CreatedAt,
                EventTypeId = reservation.EventTypeId,
                EventTypeName = reservation.EventType?.Name ?? reservation.EventMenuType,
                HasReview = reservation.Review != null,
                MenuSelections = reservation.EventMenuSelections?
                .Select(selection => new ReservationEventMenuSelectionDto
                {
                    Id = selection.Id,
                    MenuName = selection.MenuNameSnapshot,
                    Quantity = selection.Quantity,
                    PricePerPersonAtRequest = selection.PricePerPersonAtRequest,
                    TotalPrice = selection.Quantity * selection.PricePerPersonAtRequest
                })
                .ToList() ?? new List<ReservationEventMenuSelectionDto>()
            };
        }
    }
}
