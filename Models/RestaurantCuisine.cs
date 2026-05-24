namespace AplicatieRezervari.Server.Models
{
    public class RestaurantCuisine
    {
        public Guid RestaurantId { get; set; }
        public Restaurant Restaurant { get; set; } = default!;

        public Guid CuisineTypeId { get; set; }
        public CuisineType CuisineType { get; set; } = default!;
    }
}
