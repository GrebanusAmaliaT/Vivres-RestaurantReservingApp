using AplicatieRezervari.Server.DTOs;

namespace AplicatieRezervari.Server.Services
{
    public interface IReviewService
    {
        Task<ReviewDto> AddReviewAsync(CreateReviewDto dto, string userId);
        Task<IEnumerable<ReviewDto>> GetRestaurantReviewsAsync(Guid restaurantId);
    }
}