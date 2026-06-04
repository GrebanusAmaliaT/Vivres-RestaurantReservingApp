using AplicatieRezervari.Server.DTOs;

namespace AplicatieRezervari.Server.Services
{
    public interface IAdminService
    {
        Task<IEnumerable<AdminUserDto>> GetUsersAsync();

        Task<IEnumerable<AdminRestaurantDto>> GetRestaurantsAsync();

        Task DeleteReviewAsAdminAsync(Guid reviewId);

        Task<IEnumerable<ReviewDto>> GetPendingReviewsAsync();

        Task ApproveReviewAsync(Guid reviewId);

        Task RejectReviewAsync(Guid reviewId);

        Task DeleteUserAsync(string userId, string currentAdminId);
    }
}