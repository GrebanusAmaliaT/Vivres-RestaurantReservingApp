namespace AplicatieRezervari.Server.DTOs
{
    public class CreateReservationDto
    {
        public Guid RestaurantId { get; set; }
        public DateTime ReservationDate { get; set; }
        public int NumberOfPeople { get; set; }
        public string? SpecialRequests { get; set; }
    }
}