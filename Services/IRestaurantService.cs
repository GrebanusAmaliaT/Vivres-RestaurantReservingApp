using AplicatieRezervari.Server.DTOs;

namespace AplicatieRezervari.Server.Services
{
    public interface IRestaurantService
    {
        Task<IEnumerable<RestaurantDto>> GetRestaurantsAsync(
            Guid cityId,
            Guid? cuisineTypeId,
            decimal? maxBudget,
            Guid? facilityId);

        Task<RestaurantDto?> GetRestaurantByIdAsync(Guid id);
        Task<RestaurantDto?> GetRestaurantByManagerIdAsync(string managerIdStr);
        Task<object> SetupRestaurantAsync(RestaurantSetupInput input, string managerIdStr);

        Task<IEnumerable<object>> GetCuisinesAsync();
        Task<IEnumerable<object>> GetFacilitiesAsync();
    }
}