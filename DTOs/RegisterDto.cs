namespace AplicatieRezervari.Server.DTOs
{
    public class RegisterDto
    {
        public string Email { get; set; }
        public string Password { get; set; }
        public string FullName { get; set; }
        public Guid CityId { get; set; }
        public string Role { get; set; } 
    }
}
