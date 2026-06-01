using System.ComponentModel.DataAnnotations;

namespace AplicatieRezervari.Server.Models
{
    public class RestaurantTable
    {
        [Key]
        public Guid Id { get; set; }

        [Required]
        public string TableNumber { get; set; } = string.Empty;

        [Required]
        public int Capacity { get; set; }

        public Guid RestaurantId { get; set; }

        public virtual Restaurant Restaurant { get; set; } = default!;

        public virtual ICollection<Reservation> Reservations { get; set; } = new List<Reservation>();
    }
}