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
        [Authorize(Roles = "RestaurantManager")]
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
        [Authorize(Roles = "RestaurantManager")]
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

        [HttpGet("event-types")]
        public async Task<IActionResult> GetEventTypes()
        {
            var eventTypes = await _restaurantService.GetEventTypesAsync();
            return Ok(eventTypes);
        }

        [HttpGet("my-event-options")]
        [Authorize(Roles = "RestaurantManager")]
        public async Task<IActionResult> GetMyEventOptions()
        {
            var managerId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value
                            ?? User.FindFirst("id")?.Value;

            if (managerId == null)
            {
                return Unauthorized();
            }

            var options = await _restaurantService.GetMyEventOptionsAsync(managerId);
            return Ok(options);
        }

        [HttpPost("event-options")]
        [Authorize(Roles = "RestaurantManager")]
        public async Task<IActionResult> UpdateEventOptions([FromBody] UpdateRestaurantEventsDto dto)
        {
            var managerId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value
                            ?? User.FindFirst("id")?.Value;

            if (managerId == null)
            {
                return Unauthorized();
            }

            await _restaurantService.UpdateMyEventOptionsAsync(managerId, dto);

            return Ok(new
            {
                message = "Event settings updated successfully"
            });
        }

        [HttpGet("events")]
        public async Task<IActionResult> GetEventRestaurants(
            [FromQuery] Guid? cityId,
            [FromQuery] Guid? eventTypeId,
            [FromQuery] int? numberOfPeople,
            [FromQuery] decimal? maxPricePerPerson,
            [FromQuery] List<Guid>? menuTypeIds)
        {
            var restaurants = await _restaurantService.GetEventRestaurantsAsync(
                cityId,
                eventTypeId,
                numberOfPeople,
                maxPricePerPerson,
                menuTypeIds
            );

            return Ok(restaurants);
        }

        [HttpGet("menu-types")]
        public async Task<IActionResult> GetMenuTypes()
        {
            var menuTypes = await _restaurantService.GetMenuTypesAsync();
            return Ok(menuTypes);
        }

}
}