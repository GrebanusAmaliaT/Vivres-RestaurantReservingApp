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


    // --- COORDONATE GOOGLE MAPS ---
    public double? Latitude { get; set; }
    public double? Longitude { get; set; }

    public Guid CityId { get; set; }
    public virtual City City { get; set; } = default!;

    public int DefaultReservationDurationInHours { get; set; } = 2;

    public bool AcceptsEvents { get; set; }
    public decimal? WeddingMenuPricePerPerson { get; set; }
    public decimal? BaptismMenuPricePerPerson { get; set; }
    public decimal? AnniversaryMenuPricePerPerson { get; set; }
    public int? MinPeopleForEvents { get; set; }

    public TimeSpan OpeningTime { get; set; } 
    public TimeSpan ClosingTime { get; set; } 
    public virtual ICollection<RestaurantTable> Tables { get; set; }
    public virtual ICollection<RestaurantCuisine> RestaurantCuisines { get; set; } = new List<RestaurantCuisine>();
    public virtual ICollection<Reservation> Reservations { get; set; } = new List<Reservation>();
    public virtual ICollection<RestaurantFacility> RestaurantFacilities { get; set; } = new List<RestaurantFacility>();
    public virtual ICollection<Review> Reviews { get; set; } = new List<Review>();
}