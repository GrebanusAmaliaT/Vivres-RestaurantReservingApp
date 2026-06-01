using System.Security.Claims;
using AplicatieRezervari.Server.DTOs;
using AplicatieRezervari.Server.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AplicatieRezervari.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class ReservationsController : ControllerBase
    {
        private readonly IReservationService _reservationService;

        public ReservationsController(IReservationService reservationService)
        {
            _reservationService = reservationService;
        }

        [HttpPost]
        [Authorize(Roles = "Client")]
        public async Task<IActionResult> Create([FromBody] CreateReservationDto dto)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value
                         ?? User.FindFirst("id")?.Value;

            if (userId == null)
            {
                return Unauthorized();
            }

            try
            {
                var result = await _reservationService.CreateReservationAsync(dto, userId);

                return Ok(new
                {
                    message = "Cererea de rezervare a fost trimisa. Restaurantul trebuie sa o confirme.",
                    reservation = result
                });
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { message = ex.Message });
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpGet("client-history")]
        [Authorize(Roles = "Client")]
        public async Task<IActionResult> GetClientHistory()
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value
                         ?? User.FindFirst("id")?.Value;

            if (userId == null)
            {
                return Unauthorized();
            }

            var history = await _reservationService.GetClientReservationsAsync(userId);
            return Ok(history);
        }

        [HttpGet("manager-dashboard")]
        [Authorize(Roles = "RestaurantManager")]
        public async Task<IActionResult> GetManagerDashboard()
        {
            var managerId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value
                            ?? User.FindFirst("id")?.Value;

            if (managerId == null)
            {
                return Unauthorized();
            }

            var dashboardData = await _reservationService.GetManagerReservationsAsync(managerId);
            return Ok(dashboardData);
        }

        [HttpPut("{id}/status")]
        [Authorize(Roles = "RestaurantManager")]
        public async Task<IActionResult> UpdateStatus(Guid id, [FromQuery] string status)
        {
            var managerId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value
                            ?? User.FindFirst("id")?.Value;

            if (managerId == null)
            {
                return Unauthorized();
            }

            var success = await _reservationService.UpdateStatusAsync(id, status, managerId);

            if (!success)
            {
                return BadRequest(new { message = "Nu s-a putut actualiza statusul rezervarii." });
            }

            return NoContent();
        }
    }
}