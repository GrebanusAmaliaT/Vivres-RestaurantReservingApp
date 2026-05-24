namespace AplicatieRezervari.Server.DTOs
{
    public class ReservationDto
    {
        public Guid Id { get; set; }
        public DateTime ReservationDate { get; set; }
        public int NumberOfPeople { get; set; }
        public string? SpecialRequests { get; set; }
        public string Status { get; set; }
        public string RestaurantName { get; set; }
        public string RestaurantAddress { get; set; }
        public string UserEmail { get; set; }
    }
}