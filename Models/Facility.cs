namespace AplicatieRezervari.Server.Models
{
    public class Facility
    {
        public Guid Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public virtual ICollection<RestaurantFacility> RestaurantFacilities { get; set; } = new List<RestaurantFacility>();
    }
}
