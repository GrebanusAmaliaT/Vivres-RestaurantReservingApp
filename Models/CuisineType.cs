namespace AplicatieRezervari.Server.Models
{
    public class CuisineType
    {
        public Guid Id { get; set; }
        public string Name { get; set; } = string.Empty; 
        public virtual ICollection<RestaurantCuisine> RestaurantCuisines { get; set; } = new List<RestaurantCuisine>();
    }
}
