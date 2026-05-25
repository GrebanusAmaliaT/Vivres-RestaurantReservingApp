using System.ComponentModel.DataAnnotations;

namespace AplicatieRezervari.Server.Models
{
    public class RestaurantTable
    {
        [Key]
        public Guid Id { get; set; }

        [Required]
        public string TableNumber { get; set; }

        [Required]
        public int Capacity { get; set; }

        public Guid RestaurantId { get; set; }
        public virtual Restaurant Restaurant { get; set; }

        public virtual ICollection<Reservation> Reservations { get; set; }

        public RestaurantTable()
        {
            Reservations = new List<Reservation>();
        }
    }
}