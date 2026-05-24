using AplicatieRezervari.Server.DTOs;

namespace AplicatieRezervari.Server.Services
{
    public interface IReservationService
    {
        Task<ReservationDto> CreateReservationAsync(CreateReservationDto dto, string userId);
        Task<IEnumerable<ReservationDto>> GetClientReservationsAsync(string userId);
        Task<IEnumerable<ReservationDto>> GetManagerReservationsAsync(string managerId);
        Task<bool> UpdateStatusAsync(Guid reservationId, string status, string managerId);
    }
}