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

    public Guid RestaurantId { get; set; }
    public virtual Restaurant Restaurant { get; set; } = default!;

    [Required]
    public string UserId { get; set; } = string.Empty;
}