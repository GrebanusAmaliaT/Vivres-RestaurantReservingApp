namespace AplicatieRezervari.Server.DTOs
{
    public class RestaurantEventOptionDto
    {
        public Guid Id { get; set; }

        public Guid EventTypeId { get; set; }

        public string EventTypeCode { get; set; } = string.Empty;

        public string EventTypeName { get; set; } = string.Empty;

        public bool IsEnabled { get; set; }

        public decimal PricePerPerson { get; set; }

        public int MinPeople { get; set; }

        public int? MaxPeople { get; set; }

        public string? Details { get; set; }

        public List<RestaurantEventMenuOptionDto> MenuOptions { get; set; } = new();
    }
}