namespace AplicatieRezervari.Server.DTOs
{
    public class RestaurantEventSettingsDto
    {
        public bool AcceptsEvents { get; set; }

        public List<RestaurantEventOptionDto> EventOptions { get; set; } = new();
    }
}