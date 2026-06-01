using System.ComponentModel.DataAnnotations;

namespace AplicatieRezervari.Server.Models;

public class Reservation
{
    [Key]
    public Guid Id { get; set; }

    public DateTime ReservationDate { get; set; }

    public int NumberOfPeople { get; set; }

    public string? SpecialRequests { get; set; }

    [Required]
    public string Status { get; set; } = "Pending";

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public Guid RestaurantId { get; set; }
    public virtual Restaurant Restaurant { get; set; } = default!;

    public Guid? RestaurantTableId { get; set; }
    public virtual RestaurantTable? RestaurantTable { get; set; }

    public ReservationType Type { get; set; }

    public string? EventMenuType { get; set; }

    public decimal EstimatedTotalCost { get; set; }

    [Required]
    public string UserId { get; set; } = string.Empty;

    public virtual ApplicationUser? User { get; set; }
}