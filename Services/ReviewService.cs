using AplicatieRezervari.Server.Data;
using AplicatieRezervari.Server.DTOs;
using AplicatieRezervari.Server.Models;
using Microsoft.EntityFrameworkCore;

namespace AplicatieRezervari.Server.Services
{
    public class ReviewService : IReviewService
    {
        private readonly ApplicationDbContext _context;
        private readonly ILogger<ReviewService> _logger;

        public ReviewService(ApplicationDbContext context, ILogger<ReviewService> logger)
        {
            _context = context;
            _logger = logger;
        }

        public async Task<ReviewDto> AddReviewAsync(CreateReviewDto dto, string userId)
        {
            var user = await _context.Users.FindAsync(userId);
            if (user == null) throw new KeyNotFoundException("User not found");

            var review = new Review
            {
                Id = Guid.NewGuid(),
                RestaurantId = dto.RestaurantId,
                UserId = userId,
                Rating = dto.Rating,
                Comment = dto.Comment,
                CreatedAt = DateTime.UtcNow
            };

            await _context.Reviews.AddAsync(review);
            await _context.SaveChangesAsync();

            _logger.LogInformation("User {UserId} added a {Rating}-star review for restaurant {RestaurantId}", userId, dto.Rating, dto.RestaurantId);

            return new ReviewDto
            {
                Id = review.Id,
                Rating = review.Rating,
                Comment = review.Comment,
                UserFullName = user.FullName ?? user.Email!,
                CreatedAt = review.CreatedAt
            };
        }

        public async Task<IEnumerable<ReviewDto>> GetRestaurantReviewsAsync(Guid restaurantId)
        {
            return await _context.Reviews
                .Where(r => r.RestaurantId == restaurantId)
                .OrderByDescending(r => r.CreatedAt)
                .Select(r => new ReviewDto
                {
                    Id = r.Id,
                    Rating = r.Rating,
                    Comment = r.Comment,
                    UserFullName = r.User.FullName ?? r.User.Email!,
                    CreatedAt = r.CreatedAt
                })
                .ToListAsync();
        }
    }
}