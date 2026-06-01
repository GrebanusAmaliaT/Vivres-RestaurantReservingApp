using System.Security.Claims;
using AplicatieRezervari.Server.DTOs;
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

        [HttpGet("restaurant/{restaurantId}")]
        public async Task<IActionResult> GetReviews(Guid restaurantId)
        {
            var reviews = await _reviewService.GetRestaurantReviewsAsync(restaurantId);
            return Ok(reviews);
        }

        [HttpPost]
        [Authorize] 
        public async Task<IActionResult> LeaveReview([FromBody] CreateReviewDto dto)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userId == null) return Unauthorized();

            try
            {
                var result = await _reviewService.AddReviewAsync(dto, userId);
                return Ok(result);
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { message = ex.Message });
            }
        }
    }
}