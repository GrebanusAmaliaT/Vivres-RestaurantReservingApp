namespace AplicatieRezervari.Server.DTOs
{
    public class ReservationDto
    {
        public Guid Id { get; set; }
        public Guid RestaurantId { get; set; }
        public Guid? RestaurantTableId { get; set; }

        public DateTime ReservationDate { get; set; }

        public int NumberOfPeople { get; set; }

        public string? SpecialRequests { get; set; }

        public string Status { get; set; } = string.Empty;

        public string Type { get; set; } = string.Empty;

        public Guid? EventTypeId { get; set; }

        public string? EventTypeName { get; set; }

        public string? EventMenuType { get; set; }

        public string RestaurantName { get; set; } = string.Empty;

        public string RestaurantAddress { get; set; } = string.Empty;

        public string UserEmail { get; set; } = string.Empty;

        public decimal EstimatedTotalCost { get; set; }

        public List<ReservationEventMenuSelectionDto> MenuSelections { get; set; } = new();

        public DateTime CreatedAt { get; set; }
    }

    public class ReservationEventMenuSelectionDto
    {
        public Guid Id { get; set; }

        public string MenuName { get; set; } = string.Empty;

        public int Quantity { get; set; }

        public decimal PricePerPersonAtRequest { get; set; }

        public decimal TotalPrice { get; set; }
    }
}