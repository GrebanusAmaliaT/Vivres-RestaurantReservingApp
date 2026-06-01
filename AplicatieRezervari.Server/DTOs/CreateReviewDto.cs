// CreateReviewDto.cs
namespace AplicatieRezervari.Server.DTOs
{
    public class CreateReviewDto
    {
        public Guid RestaurantId { get; set; }
        public int Rating { get; set; }
        public string Comment { get; set; }
    }
}
