using System.ComponentModel.DataAnnotations;

namespace AplicatieRezervari.Server.Models
{
    public class EventType
    {
        [Key]
        public Guid Id { get; set; }

        [Required]
        public string Code { get; set; } = string.Empty;

        [Required]
        public string Name { get; set; } = string.Empty;

        public string? Description { get; set; }

        public bool IsActive { get; set; } = true;

        public virtual ICollection<RestaurantEventOption> RestaurantEventOptions { get; set; } = new List<RestaurantEventOption>();
        public virtual ICollection<Reservation> Reservations { get; set; } = new List<Reservation>();
    }
}