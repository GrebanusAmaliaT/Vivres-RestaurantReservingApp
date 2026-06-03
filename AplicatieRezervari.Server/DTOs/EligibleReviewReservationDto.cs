namespace AplicatieRezervari.Server.DTOs
{
    public class EligibleReviewReservationDto
    {
        public Guid ReservationId { get; set; }

        public Guid RestaurantId { get; set; }

        public string RestaurantName { get; set; } = string.Empty;

        public DateTime ReservationDate { get; set; }

        public int NumberOfPeople { get; set; }

        public string Type { get; set; } = string.Empty;

        public bool AlreadyReviewed { get; set; }
    }
}