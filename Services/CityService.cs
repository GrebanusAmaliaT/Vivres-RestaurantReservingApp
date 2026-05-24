using AplicatieRezervari.Server.DTOs;
using AplicatieRezervari.Server.Repositories;

namespace AplicatieRezervari.Server.Services
{
    public class CityService : ICityService
    {
        private readonly ICityRepository _cityRepository;
        private readonly ILogger<CityService> _logger;

        public CityService(ICityRepository cityRepository, ILogger<CityService> logger)
        {
            _cityRepository = cityRepository;
            _logger = logger;
        }

        public async Task<IEnumerable<CityDto>> GetAllCitiesAsync()
        {
            _logger.LogInformation("Fetching all cities from the database");

            var cities = await _cityRepository.GetAllCitiesAsync();

            var cityDtos = cities.Select(c => new CityDto
            {
                Id = c.Id,
                Name = c.Name
            });

            return cityDtos;
        }
    }
}