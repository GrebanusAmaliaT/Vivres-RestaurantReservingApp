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
        Task<IEnumerable<EventRestaurantListingDto>> GetEventRestaurantsAsync(
            Guid? cityId,
            Guid? eventTypeId,
            int? numberOfPeople,
            decimal? maxPricePerPerson);
        Task<RestaurantDto?> GetRestaurantByIdAsync(Guid id);
        Task<RestaurantDto?> GetRestaurantByManagerIdAsync(string managerIdStr);
        Task<object> SetupRestaurantAsync(RestaurantSetupInput input, string managerIdStr);

        Task<IEnumerable<object>> GetCuisinesAsync();
        Task<IEnumerable<object>> GetFacilitiesAsync();

        Task<IEnumerable<EventTypeDto>> GetEventTypesAsync();

        Task<RestaurantEventSettingsDto> GetMyEventOptionsAsync(string managerId);
        Task UpdateMyEventOptionsAsync(string managerId, UpdateRestaurantEventsDto dto);


    }
}