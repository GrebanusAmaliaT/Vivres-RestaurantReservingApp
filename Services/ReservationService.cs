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

            if (dto.NumberOfPeople > restaurant.Capacity)
            {
                throw new ArgumentException("Number of people exceeds restaurant capacity");
            }

            var reservation = new Reservation
            {
                Id = Guid.NewGuid(),
                RestaurantId = dto.RestaurantId,
                UserId = userId,
                ReservationDate = dto.ReservationDate,
                NumberOfPeople = dto.NumberOfPeople,
                SpecialRequests = dto.SpecialRequests,
                Status = "Pending"
            };

            var result = await _reservationRepository.CreateAsync(reservation);
            _logger.LogInformation("New reservation created with ID {Id} for user {UserId}", result.Id, userId);

            return new ReservationDto
            {
                Id = result.Id,
                ReservationDate = result.ReservationDate,
                NumberOfPeople = result.NumberOfPeople,
                SpecialRequests = result.SpecialRequests,
                Status = result.Status,
                RestaurantName = restaurant.Name,
                RestaurantAddress = restaurant.Address
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