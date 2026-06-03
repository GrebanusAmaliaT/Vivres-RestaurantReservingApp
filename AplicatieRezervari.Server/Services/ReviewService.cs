using AplicatieRezervari.Server.Data;
using AplicatieRezervari.Server.DTOs;
using AplicatieRezervari.Server.Models;
using Microsoft.AspNetCore.Hosting;
using Microsoft.EntityFrameworkCore;

namespace AplicatieRezervari.Server.Services
{
    public class ReviewService : IReviewService
    {
        private readonly ApplicationDbContext _context;
        private readonly IWebHostEnvironment _env;

        public ReviewService(ApplicationDbContext context, IWebHostEnvironment env)
        {
            _context = context;
            _env = env;
        }

        public async Task<ReviewDto> CreateReviewAsync(CreateReviewDto dto, string userId)
        {
            var reservation = await _context.Reservations
                .Include(r => r.Restaurant)
                .Include(r => r.User)
                .Include(r => r.Review)
                .FirstOrDefaultAsync(r => r.Id == dto.ReservationId);

            if (reservation == null)
            {
                throw new KeyNotFoundException("Rezervarea nu exista.");
            }

            if (reservation.UserId != userId)
            {
                throw new UnauthorizedAccessException("Nu poti lasa review pentru rezervarea altui utilizator.");
            }

            if (reservation.ReservationDate > DateTime.Now)
            {
                throw new ArgumentException("Poti lasa review doar dupa ce data rezervarii a trecut.");
            }

            if (reservation.Status != "Confirmed")
            {
                throw new ArgumentException("Poti lasa review doar pentru rezervari confirmate.");
            }

            if (reservation.Review != null)
            {
                throw new ArgumentException("Ai lasat deja review pentru aceasta rezervare.");
            }

            if (dto.Images != null && dto.Images.Count > 5)
            {
                throw new ArgumentException("Poti incarca maximum 5 poze pentru un review.");
            }

            var review = new Review
            {
                Id = Guid.NewGuid(),
                ReservationId = reservation.Id,
                RestaurantId = reservation.RestaurantId,
                UserId = userId,
                Rating = dto.Rating,
                Comment = dto.Comment,
                Type = reservation.Type,
                CreatedAt = DateTime.UtcNow
            };

            var imageUrls = await SaveReviewImagesAsync(dto.Images);

            foreach (var imageUrl in imageUrls)
            {
                review.Images.Add(new ReviewImage
                {
                    Id = Guid.NewGuid(),
                    ImageUrl = imageUrl
                });
            }

            _context.Reviews.Add(review);
            await _context.SaveChangesAsync();

            var savedReview = await _context.Reviews
                .Include(r => r.Restaurant)
                .Include(r => r.User)
                .Include(r => r.Reservation)
                .Include(r => r.Images)
                .FirstAsync(r => r.Id == review.Id);

            return MapToDto(savedReview);
        }

        public async Task<IEnumerable<ReviewDto>> GetRestaurantReviewsAsync(
            Guid restaurantId,
            ReservationType? type)
        {
            var query = _context.Reviews
                .Include(r => r.Restaurant)
                .Include(r => r.User)
                .Include(r => r.Reservation)
                .Include(r => r.Images)
                .Where(r => r.RestaurantId == restaurantId);

            if (type.HasValue)
            {
                query = query.Where(r => r.Type == type.Value);
            }

            return await query
                .OrderByDescending(r => r.CreatedAt)
                .Select(r => MapToDto(r))
                .ToListAsync();
        }

        public async Task<IEnumerable<EligibleReviewReservationDto>> GetMyEligibleReservationsAsync(string userId)
        {
            var now = DateTime.Now;

            return await _context.Reservations
                .Include(r => r.Restaurant)
                .Include(r => r.Review)
                .Where(r =>
                    r.UserId == userId &&
                    r.ReservationDate <= now &&
                    r.Status == "Confirmed")
                .OrderByDescending(r => r.ReservationDate)
                .Select(r => new EligibleReviewReservationDto
                {
                    ReservationId = r.Id,
                    RestaurantId = r.RestaurantId,
                    RestaurantName = r.Restaurant.Name,
                    ReservationDate = r.ReservationDate,
                    NumberOfPeople = r.NumberOfPeople,
                    Type = r.Type.ToString(),
                    AlreadyReviewed = r.Review != null
                })
                .ToListAsync();
        }

        private async Task<List<string>> SaveReviewImagesAsync(List<IFormFile>? images)
        {
            var imageUrls = new List<string>();

            if (images == null || images.Count == 0)
            {
                return imageUrls;
            }

            string uploadsFolder = Path.Combine(_env.WebRootPath, "uploads", "reviews");

            if (!Directory.Exists(uploadsFolder))
            {
                Directory.CreateDirectory(uploadsFolder);
            }

            foreach (var image in images)
            {
                if (image.Length == 0)
                {
                    continue;
                }

                if (!image.ContentType.StartsWith("image/"))
                {
                    throw new ArgumentException("Poti incarca doar fisiere imagine.");
                }

                if (image.Length > 5 * 1024 * 1024)
                {
                    throw new ArgumentException("Fiecare poza trebuie sa aiba maximum 5MB.");
                }

                string extension = Path.GetExtension(image.FileName);
                string fileName = $"{Guid.NewGuid()}{extension}";
                string path = Path.Combine(uploadsFolder, fileName);

                using var stream = new FileStream(path, FileMode.Create);
                await image.CopyToAsync(stream);

                imageUrls.Add($"/uploads/reviews/{fileName}");
            }

            return imageUrls;
        }

        public async Task<IEnumerable<ReviewDto>> GetMyReviewsAsync(string userId)
        {
            return await _context.Reviews
                .Include(r => r.Restaurant)
                .Include(r => r.User)
                .Include(r => r.Reservation)
                .Include(r => r.Images)
                .Where(r => r.UserId == userId)
                .OrderByDescending(r => r.CreatedAt)
                .Select(r => MapToDto(r))
                .ToListAsync();
        }

        public async Task DeleteReviewAsync(Guid reviewId, string userId)
        {
            var review = await _context.Reviews
                .Include(r => r.Images)
                .FirstOrDefaultAsync(r => r.Id == reviewId);

            if (review == null)
            {
                throw new KeyNotFoundException("Review-ul nu exista.");
            }

            if (review.UserId != userId)
            {
                throw new UnauthorizedAccessException("Nu poti sterge review-ul altui utilizator.");
            }

            foreach (var image in review.Images)
            {
                DeletePhysicalFile(image.ImageUrl);
            }

            _context.Reviews.Remove(review);
            await _context.SaveChangesAsync();
        }

        private void DeletePhysicalFile(string? relativeUrl)
        {
            if (string.IsNullOrEmpty(relativeUrl))
            {
                return;
            }

            try
            {
                string fullPath = Path.Combine(_env.WebRootPath, relativeUrl.TrimStart('/'));

                if (File.Exists(fullPath))
                {
                    File.Delete(fullPath);
                }
            }
            catch
            {
                // Nu blocam stergerea review-ului daca fisierul fizic nu poate fi sters.
            }
        }
        private static ReviewDto MapToDto(Review review)
        {
            return new ReviewDto
            {
                Id = review.Id,
                ReservationId = review.ReservationId,
                RestaurantId = review.RestaurantId,
                RestaurantName = review.Restaurant?.Name ?? string.Empty,
                UserFullName = review.User?.FullName ?? string.Empty,
                UserEmail = review.User?.Email ?? string.Empty,
                Rating = review.Rating,
                Comment = review.Comment,
                Type = review.Type.ToString(),
                ReservationDate = review.Reservation?.ReservationDate ?? default,
                CreatedAt = review.CreatedAt,
                ImageUrls = review.Images?.Select(i => i.ImageUrl).ToList() ?? new List<string>()
            };
        }
    }
}