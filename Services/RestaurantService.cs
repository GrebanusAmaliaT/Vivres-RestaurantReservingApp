using AplicatieRezervari.Server.DTOs;
using AplicatieRezervari.Server.Repositories;

namespace AplicatieRezervari.Server.Services
{
    public class RestaurantService : IRestaurantService
    {
        private readonly IRestaurantRepository _restaurantRepository;
        private readonly ILogger<RestaurantService> _logger;

        public RestaurantService(IRestaurantRepository restaurantRepository, ILogger<RestaurantService> logger)
        {
            _restaurantRepository = restaurantRepository;
            _logger = logger;
        }

        public async Task<IEnumerable<RestaurantDto>> GetRestaurantsAsync(Guid cityId, Guid? cuisineTypeId, decimal? maxBudget, Guid? facilityId)
        {
            _logger.LogInformation("Filtering restaurants for cityId: {CityId}, cuisine: {Cuisine}, budget: {Budget}, facility: {Facility}",
                cityId, cuisineTypeId, maxBudget, facilityId);

            var restaurants = await _restaurantRepository.GetFilteredRestaurantsAsync(cityId, cuisineTypeId, maxBudget, facilityId);

            return restaurants.Select(r => new RestaurantDto
            {
                Id = r.Id,
                Name = r.Name,
                Address = r.Address,
                Description = r.Description,
                Capacity = r.Capacity,
                AverageBudget = r.AverageBudget,
                CityName = r.City.Name,
                CuisineTypes = r.RestaurantCuisines.Select(rc => rc.CuisineType.Name).ToList(),
                Facilities = r.RestaurantFacilities.Select(rf => rf.Facility.Name).ToList()
            });
        }

        public async Task<RestaurantDto?> GetRestaurantByIdAsync(Guid id)
        {
            _logger.LogInformation("Fetching restaurant details for id: {Id}", id);

            var r = await _restaurantRepository.GetRestaurantByIdAsync(id);
            if (r == null) return null;

            return new RestaurantDto
            {
                Id = r.Id,
                Name = r.Name,
                Address = r.Address,
                Description = r.Description,
                Capacity = r.Capacity,
                AverageBudget = r.AverageBudget,
                CityName = r.City.Name,
                CuisineTypes = r.RestaurantCuisines.Select(rc => rc.CuisineType.Name).ToList(),
                Facilities = r.RestaurantFacilities.Select(rf => rf.Facility.Name).ToList()
            };
        }
    }
}