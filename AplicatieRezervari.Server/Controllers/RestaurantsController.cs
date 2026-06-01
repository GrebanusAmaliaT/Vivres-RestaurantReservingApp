using AplicatieRezervari.Server.DTOs;
using AplicatieRezervari.Server.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;


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

        [HttpPost("setup")]
        [Authorize]
        public async Task<IActionResult> SetupRestaurant([FromForm] RestaurantSetupInput input)
        {
            var managerId = User.FindFirstValue(ClaimTypes.NameIdentifier)
                            ?? User.FindFirstValue("id");

            if (string.IsNullOrEmpty(managerId))
                return Unauthorized(new { message = "Manager not found from token." });

            var result = await _restaurantService.SetupRestaurantAsync(input, managerId);
            return Ok(result);
        }

        [HttpGet("my-restaurant")]
        [Authorize]
        public async Task<IActionResult> GetMyRestaurant()
        {
            var managerId = User.FindFirstValue(ClaimTypes.NameIdentifier)
                            ?? User.FindFirstValue("id");

            if (string.IsNullOrEmpty(managerId))
                return Unauthorized(new { message = "Manager not found from token." });

            var restaurant = await _restaurantService.GetRestaurantByManagerIdAsync(managerId);

            if (restaurant == null)
                return NotFound(new { message = "Restaurant profile not found." });

            return Ok(restaurant);
        }

        [HttpGet("cuisines")]
        public async Task<IActionResult> GetCuisines()
        {
            var cuisines = await _restaurantService.GetCuisinesAsync();
            return Ok(cuisines);
        }

        [HttpGet("facilities")]
        public async Task<IActionResult> GetFacilities()
        {
            var facilities = await _restaurantService.GetFacilitiesAsync();
            return Ok(facilities);
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

        [HttpGet("{id:guid}")]
        public async Task<IActionResult> GetById(Guid id)
        {
            var restaurant = await _restaurantService.GetRestaurantByIdAsync(id);

            if (restaurant == null)
                return NotFound(new { message = "Restaurant not found" });

            return Ok(restaurant);
        }
    }
}