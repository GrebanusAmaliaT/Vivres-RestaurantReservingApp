using System.ComponentModel.DataAnnotations;

namespace AplicatieRezervari.Server.Models;

public class Restaurant
{
    [Key]
    public Guid Id { get; set; }

    [Required]
    public string Name { get; set; } = string.Empty;
    public string Address { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public int Capacity { get; set; }
    public decimal AverageBudget { get; set; }
    public string? ManagerId { get; set; }

    public Guid CityId { get; set; }
    public virtual City City { get; set; } = default!;

    public virtual ICollection<RestaurantCuisine> RestaurantCuisines { get; set; } = new List<RestaurantCuisine>();
    public virtual ICollection<Reservation> Reservations { get; set; } = new List<Reservation>();
    public virtual ICollection<RestaurantFacility> RestaurantFacilities { get; set; } = new List<RestaurantFacility>();
    public virtual ICollection<Review> Reviews { get; set; } = new List<Review>();
}