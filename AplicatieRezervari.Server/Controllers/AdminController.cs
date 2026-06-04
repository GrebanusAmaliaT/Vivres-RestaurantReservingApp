using AplicatieRezervari.Server.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace AplicatieRezervari.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "Admin")]
    public class AdminController : ControllerBase
    {
        private readonly IAdminService _adminService;

        public AdminController(IAdminService adminService)
        {
            _adminService = adminService;
        }

        [HttpGet("users")]
        public async Task<IActionResult> GetUsers()
        {
            var users = await _adminService.GetUsersAsync();
            return Ok(users);
        }

        [HttpGet("restaurants")]
        public async Task<IActionResult> GetRestaurants()
        {
            var restaurants = await _adminService.GetRestaurantsAsync();
            return Ok(restaurants);
        }

        [HttpDelete("reviews/{reviewId:guid}")]
        public async Task<IActionResult> DeleteReview(Guid reviewId)
        {
            await _adminService.DeleteReviewAsAdminAsync(reviewId);
            return NoContent();
        }

        [HttpGet("reviews/pending")]
        public async Task<IActionResult> GetPendingReviews()
        {
            var reviews = await _adminService.GetPendingReviewsAsync();
            return Ok(reviews);
        }

        [HttpPut("reviews/{reviewId:guid}/approve")]
        public async Task<IActionResult> ApproveReview(Guid reviewId)
        {
            await _adminService.ApproveReviewAsync(reviewId);
            return NoContent();
        }

        [HttpDelete("reviews/{reviewId:guid}/reject")]
        public async Task<IActionResult> RejectReview(Guid reviewId)
        {
            await _adminService.RejectReviewAsync(reviewId);
            return NoContent();
        }

        [HttpDelete("users/{userId}")]
        public async Task<IActionResult> DeleteUser(string userId)
        {
            var currentAdminId = User.FindFirstValue(ClaimTypes.NameIdentifier)
                                 ?? User.FindFirstValue("id");

            if (string.IsNullOrEmpty(currentAdminId))
            {
                return Unauthorized(new { message = "Admin not found from token." });
            }

            await _adminService.DeleteUserAsync(userId, currentAdminId);
            return NoContent();
        }
    }
}