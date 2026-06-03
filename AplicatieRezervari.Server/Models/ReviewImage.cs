using System.ComponentModel.DataAnnotations;

namespace AplicatieRezervari.Server.Models
{
    public class ReviewImage
    {
        [Key]
        public Guid Id { get; set; }

        public Guid ReviewId { get; set; }

        public virtual Review Review { get; set; } = default!;

        [Required]
        public string ImageUrl { get; set; } = string.Empty;
    }
}