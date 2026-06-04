using AplicatieRezervari.Server.Data;
using AplicatieRezervari.Server.DTOs;
using AplicatieRezervari.Server.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace AplicatieRezervari.Server.Services
{
    public class AdminService : IAdminService
    {
        private readonly ApplicationDbContext _context;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly IWebHostEnvironment _env;

        public AdminService(
            ApplicationDbContext context,
            UserManager<ApplicationUser> userManager,
            IWebHostEnvironment env)
        {
            _context = context;
            _userManager = userManager;
            _env = env;
        }

        public async Task<IEnumerable<AdminUserDto>> GetUsersAsync()
        {
            var users = await _context.Users
                .OrderBy(u => u.Email)
                .ToListAsync();

            var result = new List<AdminUserDto>();

            foreach (var user in users)
            {
                var roles = await _userManager.GetRolesAsync(user);

                result.Add(new AdminUserDto
                {
                    Id = user.Id,
                    Email = user.Email ?? string.Empty,
                    UserName = user.UserName ?? string.Empty,
                    HasProfileCompleted = user.HasProfileCompleted,
                    Roles = roles
                });
            }

            return result;
        }

        public async Task<IEnumerable<AdminRestaurantDto>> GetRestaurantsAsync()
        {
            return await _context.Restaurants
                .Include(r => r.City)
                .OrderBy(r => r.Name)
                .Select(r => new AdminRestaurantDto
                {
                    Id = r.Id,
                    Name = r.Name,
                    Address = r.Address,
                    CityName = r.City != null ? r.City.Name : string.Empty,
                    Capacity = r.Capacity,
                    AcceptsEvents = r.AcceptsEvents,
                    ManagerId = r.ManagerId
                })
                .ToListAsync();
        }

        public async Task DeleteReviewAsAdminAsync(Guid reviewId)
        {
            var review = await _context.Reviews
                .Include(r => r.Images)
                .FirstOrDefaultAsync(r => r.Id == reviewId);

            if (review == null)
            {
                throw new KeyNotFoundException("Review-ul nu exista.");
            }

            foreach (var image in review.Images)
            {
                DeletePhysicalFile(image.ImageUrl);
            }

            _context.Reviews.Remove(review);
            await _context.SaveChangesAsync();
        }
        public async Task<IEnumerable<ReviewDto>> GetPendingReviewsAsync()
        {
            return await _context.Reviews
                .Include(r => r.Restaurant)
                .Include(r => r.User)
                .Include(r => r.Reservation)
                .Include(r => r.Images)
                .Where(r => !r.IsApproved)
                .OrderByDescending(r => r.CreatedAt)
                .Select(r => new ReviewDto
                {
                    Id = r.Id,
                    ReservationId = r.ReservationId,
                    RestaurantId = r.RestaurantId,
                    RestaurantName = r.Restaurant != null ? r.Restaurant.Name : string.Empty,
                    UserFullName = r.User != null ? r.User.FullName : string.Empty,
                    UserEmail = r.User != null ? r.User.Email ?? string.Empty : string.Empty,
                    Rating = r.Rating,
                    Comment = r.Comment,
                    Type = r.Type.ToString(),
                    ReservationDate = r.Reservation != null ? r.Reservation.ReservationDate : default,
                    CreatedAt = r.CreatedAt,
                    IsApproved = r.IsApproved,
                    ImageUrls = r.Images.Select(i => i.ImageUrl).ToList()
                })
                .ToListAsync();
        }

        public async Task ApproveReviewAsync(Guid reviewId)
        {
            var review = await _context.Reviews.FindAsync(reviewId);

            if (review == null)
            {
                throw new KeyNotFoundException("Review-ul nu exista.");
            }

            review.IsApproved = true;
            await _context.SaveChangesAsync();
        }

        public async Task RejectReviewAsync(Guid reviewId)
        {
            await DeleteReviewAsAdminAsync(reviewId);
        }

        public async Task DeleteUserAsync(string userId, string currentAdminId)
        {
            if (userId == currentAdminId)
            {
                throw new ArgumentException("Nu iti poti sterge propriul cont de admin.");
            }

            var user = await _userManager.FindByIdAsync(userId);

            if (user == null)
            {
                throw new KeyNotFoundException("Utilizatorul nu exista.");
            }

            var roles = await _userManager.GetRolesAsync(user);

            if (roles.Contains("Admin"))
            {
                throw new ArgumentException("Nu poti sterge un cont de Admin.");
            }

            if (roles.Contains("RestaurantManager"))
            {
                throw new ArgumentException("Nu poti sterge direct un RestaurantManager, deoarece poate avea restaurant asociat.");
            }

            var userReviews = await _context.Reviews
                .Include(r => r.Images)
                .Where(r => r.UserId == userId)
                .ToListAsync();

            foreach (var review in userReviews)
            {
                foreach (var image in review.Images)
                {
                    DeletePhysicalFile(image.ImageUrl);
                }
            }

            _context.Reviews.RemoveRange(userReviews);

            var reservations = await _context.Reservations
                .Where(r => r.UserId == userId)
                .ToListAsync();

            _context.Reservations.RemoveRange(reservations);

            await _context.SaveChangesAsync();

            var result = await _userManager.DeleteAsync(user);

            if (!result.Succeeded)
            {
                throw new ArgumentException("Utilizatorul nu a putut fi sters.");
            }
        }
        private void DeletePhysicalFile(string? relativeUrl)
        {
            if (string.IsNullOrWhiteSpace(relativeUrl))
            {
                return;
            }

            try
            {
                var fullPath = Path.Combine(_env.WebRootPath, relativeUrl.TrimStart('/'));

                if (File.Exists(fullPath))
                {
                    File.Delete(fullPath);
                }
            }
            catch
            {
            }
        }
    }
}