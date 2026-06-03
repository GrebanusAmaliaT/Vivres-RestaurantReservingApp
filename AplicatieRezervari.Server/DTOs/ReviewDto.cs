namespace AplicatieRezervari.Server.DTOs
{
    public class ReviewDto
    {
        public Guid Id { get; set; }

        public Guid ReservationId { get; set; }

        public Guid RestaurantId { get; set; }

        public string RestaurantName { get; set; } = string.Empty;

        public string UserFullName { get; set; } = string.Empty;

        public string UserEmail { get; set; } = string.Empty;

        public int Rating { get; set; }

        public string? Comment { get; set; }

        public string Type { get; set; } = string.Empty;

        public DateTime ReservationDate { get; set; }

        public DateTime CreatedAt { get; set; }

        public List<string> ImageUrls { get; set; } = new();
    }
}