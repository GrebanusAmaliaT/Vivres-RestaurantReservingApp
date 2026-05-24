using AplicatieRezervari.Server.DTOs;

namespace AplicatieRezervari.Server.Services
{
    public interface ICityService
    {
        Task<IEnumerable<CityDto>> GetAllCitiesAsync();
    }
}