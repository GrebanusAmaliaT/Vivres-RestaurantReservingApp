using System.Security.Claims;
using AplicatieRezervari.Server.DTOs;
using AplicatieRezervari.Server.Models;
using AplicatieRezervari.Server.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AplicatieRezervari.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ReviewsController : ControllerBase
    {
        private readonly IReviewService _reviewService;

        public ReviewsController(IReviewService reviewService)
        {
            _reviewService = reviewService;
        }

        [HttpPost]
        [Authorize(Roles = "Client")]
        public async Task<IActionResult> CreateReview([FromForm] CreateReviewDto dto)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)
                         ?? User.FindFirstValue("id");

            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized(new { message = "User not found from token." });
            }

            try
            {
                var review = await _reviewService.CreateReviewAsync(dto, userId);
                return Ok(review);
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { message = ex.Message });
            }
            catch (UnauthorizedAccessException ex)
            {
                return Forbid(ex.Message);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpGet("restaurant/{restaurantId:guid}")]
        [AllowAnonymous]
        public async Task<IActionResult> GetRestaurantReviews(
            Guid restaurantId,
            [FromQuery] string? type)
        {
            ReservationType? reservationType = null;

            if (!string.IsNullOrEmpty(type))
            {
                if (!Enum.TryParse<ReservationType>(type, true, out var parsedType))
                {
                    return BadRequest(new { message = "Invalid review type." });
                }

                reservationType = parsedType;
            }

            var reviews = await _reviewService.GetRestaurantReviewsAsync(restaurantId, reservationType);
            return Ok(reviews);
        }

        [HttpGet("my-eligible-reservations")]
        [Authorize(Roles = "Client")]
        public async Task<IActionResult> GetMyEligibleReservations()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)
                         ?? User.FindFirstValue("id");

            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized(new { message = "User not found from token." });
            }

            var reservations = await _reviewService.GetMyEligibleReservationsAsync(userId);
            return Ok(reservations);
        }

        [HttpGet("my-reviews")]
        [Authorize(Roles = "Client")]
        public async Task<IActionResult> GetMyReviews()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)
                         ?? User.FindFirstValue("id");

            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized(new { message = "User not found from token." });
            }

            var reviews = await _reviewService.GetMyReviewsAsync(userId);
            return Ok(reviews);
        }

        [HttpDelete("{reviewId:guid}")]
        [Authorize(Roles = "Client")]
        public async Task<IActionResult> DeleteReview(Guid reviewId)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)
                         ?? User.FindFirstValue("id");

            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized(new { message = "User not found from token." });
            }

            try
            {
                await _reviewService.DeleteReviewAsync(reviewId, userId);
                return Ok(new { message = "Review deleted successfully." });
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { message = ex.Message });
            }
            catch (UnauthorizedAccessException ex)
            {
                return Forbid(ex.Message);
            }
        }
    }
}