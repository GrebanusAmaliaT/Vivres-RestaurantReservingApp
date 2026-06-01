
namespace AplicatieRezervari.Server.DTOs
{
    public class AuthResultDto
    {
        public bool IsSuccess { get; set; }
        public string Token { get; set; }
        public string Message { get; set; }
        public string Role { get; set; }
        public Guid? CityId { get; set; }
        public bool HasProfileCompleted { get; set; }
    }
}