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
                throw new KeyNotFoundException("Restaurant not found");
            }

            // Main orchestrator splits the logic based on reservation type
            if (dto.IsEvent)
            {
                return await HandleEventReservationAsync(dto, restaurant, userId);
            }

            return await HandleRegularReservationAsync(dto, restaurant, userId);
        }

        private async Task<ReservationDto> HandleEventReservationAsync(CreateReservationDto dto, Restaurant restaurant, string userId)
        {
            if (!restaurant.AcceptsEvents)
            {
                throw new ArgumentException("This restaurant does not host special events");
            }

            if (restaurant.MinPeopleForEvents.HasValue && dto.NumberOfPeople < restaurant.MinPeopleForEvents.Value)
            {
                throw new ArgumentException($"Minimum required people for an event at this location is {restaurant.MinPeopleForEvents}");
            }

            if (dto.NumberOfPeople > restaurant.Capacity)
            {
                throw new ArgumentException("The number of people exceeds the total capacity of the restaurant");
            }

            // Check if the restaurant has ANY reservation on that specific day
            var hasExistingReservations = restaurant.Tables.Any(t => t.Reservations.Any(r =>
                r.Status == "Confirmed" && r.ReservationDate.Date == dto.ReservationDate.Date));

            if (hasExistingReservations)
            {
                throw new ArgumentException("The restaurant is already booked for another reservation or event on this day");
            }

            decimal menuPrice = dto.EventMenuType?.ToLower() switch
            {
                "wedding" => restaurant.WeddingMenuPricePerPerson ?? 0,
                "baptism" => restaurant.BaptismMenuPricePerPerson ?? 0,
                _ => restaurant.AnniversaryMenuPricePerPerson ?? 0
            };

            var reservation = new Reservation
            {
                Id = Guid.NewGuid(),
                RestaurantId = restaurant.Id,
                UserId = userId,
                ReservationDate = dto.ReservationDate,
                NumberOfPeople = dto.NumberOfPeople,
                SpecialRequests = dto.SpecialRequests,
                Status = "Pending",
                Type = ReservationType.Event,
                EventMenuType = dto.EventMenuType,
                EstimatedTotalCost = menuPrice * dto.NumberOfPeople,
                RestaurantTableId = null
            };

            var result = await _reservationRepository.CreateAsync(reservation);
            _logger.LogInformation("Event reservation {Id} created for venue {RestaurantId}", result.Id, restaurant.Id);

            return MapToDto(result, restaurant.Name);
        }

        private async Task<ReservationDto> HandleRegularReservationAsync(CreateReservationDto dto, Restaurant restaurant, string userId)
        {
            var reservationTime = dto.ReservationDate.TimeOfDay;
            if (reservationTime < restaurant.OpeningTime || reservationTime > restaurant.ClosingTime)
            {
                throw new ArgumentException("The restaurant is closed at the selected time");
            }

            var requestedStart = dto.ReservationDate;
            var requestedEnd = requestedStart.AddHours(restaurant.DefaultReservationDurationInHours);

           var availableTable = restaurant.Tables
                .Where(t => t.Capacity >= dto.NumberOfPeople)
                .OrderBy(t => t.Capacity)
                .FirstOrDefault(t => !t.Reservations.Any(r =>
                    r.Status == "Confirmed" &&
                    ((requestedStart >= r.ReservationDate && requestedStart < r.ReservationDate.AddHours(restaurant.DefaultReservationDurationInHours)) ||
                     (requestedEnd > r.ReservationDate && requestedEnd <= r.ReservationDate.AddHours(restaurant.DefaultReservationDurationInHours)) ||
                     (requestedStart <= r.ReservationDate && requestedEnd >= r.ReservationDate.AddHours(restaurant.DefaultReservationDurationInHours)))));

            if (availableTable == null)
            {
                throw new ArgumentException("No tables available for the selected time and number of people");
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
                Type = ReservationType.Regular,
                RestaurantTableId = availableTable.Id,
                EstimatedTotalCost = 0
            };

            var result = await _reservationRepository.CreateAsync(reservation);
            _logger.LogInformation("Regular reservation {Id} assigned to Table {TableId}", result.Id, availableTable.Id);

            return MapToDto(result, restaurant.Name);
        }

        private ReservationDto MapToDto(Reservation result, string restaurantName)
        {
            return new ReservationDto
            {
                Id = result.Id,
                ReservationDate = result.ReservationDate, // or result.ReservationDate depending on your model field name
                NumberOfPeople = result.NumberOfPeople,
                Status = result.Status,
                RestaurantName = restaurantName,
                EstimatedTotalCost = result.EstimatedTotalCost
            };
        }


        public async Task<IEnumerable<ReservationDto>> GetClientReservationsAsync(string userId)
        {
            var list = await _reservationRepository.GetByUserIdAsync(userId);
            return list.Select(r => new ReservationDto
            {
                Id = r.Id,
                ReservationDate = r.ReservationDate,
                NumberOfPeople = r.NumberOfPeople,
                SpecialRequests = r.SpecialRequests,
                Status = r.Status,
                RestaurantName = r.Restaurant.Name,
                RestaurantAddress = r.Restaurant.Address
            });
        }

        public async Task<IEnumerable<ReservationDto>> GetManagerReservationsAsync(string managerId)
        {
            var list = await _reservationRepository.GetByRestaurantManagerIdAsync(managerId);
            return list.Select(r => new ReservationDto
            {
                Id = r.Id,
                ReservationDate = r.ReservationDate,
                NumberOfPeople = r.NumberOfPeople,
                SpecialRequests = r.SpecialRequests,
                Status = r.Status,
                RestaurantName = r.Restaurant.Name,
                RestaurantAddress = r.Restaurant.Address
            });
        }

        public async Task<bool> UpdateStatusAsync(Guid reservationId, string status, string managerId)
        {
            var reservation = await _reservationRepository.GetByIdAsync(reservationId);
            if (reservation == null) return false;

            if (reservation.Restaurant.ManagerId != managerId)
            {
                _logger.LogWarning("Unauthorized status change attempt by manager {ManagerId}", managerId);
                return false;
            }

            reservation.Status = status;
            await _reservationRepository.UpdateAsync(reservation);
            _logger.LogInformation("Reservation {Id} status updated to {Status}", reservationId, status);
            return true;
        }
    }
}