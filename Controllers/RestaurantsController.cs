using AplicatieRezervari.Server.DTOs;
using AplicatieRezervari.Server.Services;
using Microsoft.AspNetCore.Mvc;

namespace AplicatieRezervari.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class RestaurantsController : ControllerBase
    {
        private readonly IRestaurantService _restaurantService;

        public RestaurantsController(IRestaurantService restaurantService)
        {
            _restaurantService = restaurantService;
        }

        [HttpGet]
        public async Task<IActionResult> GetRestaurants(
            [FromQuery] Guid cityId,
            [FromQuery] Guid? cuisineTypeId,
            [FromQuery] decimal? maxBudget,
            [FromQuery] Guid? facilityId)
        {
            var restaurants = await _restaurantService.GetRestaurantsAsync(cityId, cuisineTypeId, maxBudget, facilityId);
            return Ok(restaurants);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(Guid id)
        {
            var restaurant = await _restaurantService.GetRestaurantByIdAsync(id);
            if (restaurant == null)
            {
                return NotFound(new { message = "Restaurant not found" });
            }
            return Ok(restaurant);
        }
    }
}