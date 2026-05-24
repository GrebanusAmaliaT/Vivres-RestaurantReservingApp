namespace AplicatieRezervari.Server.DTOs
{
    public class ReviewDto
    {
        public Guid Id { get; set; }
        public int Rating { get; set; }
        public string Comment { get; set; }
        public string UserFullName { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}