namespace AplicatieRezervari.Server.DTOs
{
    public class EventRestaurantListingDto
    {
        public Guid Id { get; set; }

        public string Name { get; set; } = string.Empty;

        public string Address { get; set; } = string.Empty;

        public string Description { get; set; } = string.Empty;

        public Guid CityId { get; set; }

        public string CityName { get; set; } = string.Empty;

        public int Capacity { get; set; }

        public decimal AverageBudget { get; set; }

        public string? Image1Url { get; set; }

        public string? Image2Url { get; set; }

        public string? Image3Url { get; set; }

        public List<RestaurantEventOptionPublicDto> EventOptions { get; set; } = new();

        public decimal MinEventPricePerPerson { get; set; }
    }

    public class RestaurantEventOptionPublicDto
    {
        public Guid EventTypeId { get; set; }

        public string EventTypeCode { get; set; } = string.Empty;

        public string EventTypeName { get; set; } = string.Empty;

        public decimal PricePerPerson { get; set; }

        public int MinPeople { get; set; }

        public int? MaxPeople { get; set; }

        public string? Details { get; set; }

        public List<RestaurantEventMenuOptionPublicDto> MenuOptions { get; set; } = new();
    }

    public class RestaurantEventMenuOptionPublicDto
    {
        public Guid Id { get; set; }

        public Guid MenuTypeId { get; set; }

        public string MenuTypeCode { get; set; } = string.Empty;

        public string MenuTypeName { get; set; } = string.Empty;

        public decimal PricePerPerson { get; set; }

        public string? Details { get; set; }
    }
}