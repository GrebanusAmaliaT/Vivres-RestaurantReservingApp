namespace AplicatieRezervari.Server.Models
{
    public class City
    {
        public Guid Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public virtual ICollection<Restaurant> Restaurants { get; set; } = new List<Restaurant>();
        public virtual ICollection<ApplicationUser> Users { get; set; } = new List<ApplicationUser>();
    }
}
