using System.ComponentModel.DataAnnotations;

namespace AplicatieRezervari.Server.Models
{
    public class Review
    {
        [Key]
        public Guid Id { get; set; }

        [Required]
        [Range(1, 5)]
        public int Rating { get; set; }

        [Required]
        public string Comment { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Relations
        public Guid RestaurantId { get; set; }
        public virtual Restaurant Restaurant { get; set; }

        public string UserId { get; set; }
        public virtual ApplicationUser User { get; set; }
    }
}