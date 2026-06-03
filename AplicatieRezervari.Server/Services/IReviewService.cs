using AplicatieRezervari.Server.DTOs;
using AplicatieRezervari.Server.Models;

namespace AplicatieRezervari.Server.Services
{
    public interface IReviewService
    {
        Task<ReviewDto> CreateReviewAsync(CreateReviewDto dto, string userId);

        Task<IEnumerable<ReviewDto>> GetRestaurantReviewsAsync(
            Guid restaurantId,
            ReservationType? type);

        Task<IEnumerable<EligibleReviewReservationDto>> GetMyEligibleReservationsAsync(string userId);

        Task<IEnumerable<ReviewDto>> GetMyReviewsAsync(string userId);

        Task DeleteReviewAsync(Guid reviewId, string userId);
    }
}