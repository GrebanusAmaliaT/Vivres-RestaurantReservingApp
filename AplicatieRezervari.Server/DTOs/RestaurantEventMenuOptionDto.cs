namespace AplicatieRezervari.Server.DTOs
{
    public class RestaurantEventMenuOptionDto
    {
        public Guid Id { get; set; }

        public Guid MenuTypeId { get; set; }

        public string MenuTypeCode { get; set; } = string.Empty;

        public string MenuTypeName { get; set; } = string.Empty;

        public bool IsEnabled { get; set; }

        public decimal PricePerPerson { get; set; }

        public string? Details { get; set; }
    }
}