using System.ComponentModel.DataAnnotations;

namespace AplicatieRezervari.Server.Models
{
    public class Review
    {
        [Key]
        public Guid Id { get; set; }

        [Required]
        public Guid ReservationId { get; set; }

        public virtual Reservation Reservation { get; set; } = default!;

        [Required]
        public Guid RestaurantId { get; set; }

        public virtual Restaurant Restaurant { get; set; } = default!;

        [Required]
        public string UserId { get; set; } = string.Empty;

        public virtual ApplicationUser User { get; set; } = default!;

        [Range(1, 5)]
        public int Rating { get; set; }

        [MaxLength(1000)]
        public string? Comment { get; set; }

        public ReservationType Type { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public virtual ICollection<ReviewImage> Images { get; set; } = new List<ReviewImage>();

        public bool IsApproved { get; set; } = false;
    }
}