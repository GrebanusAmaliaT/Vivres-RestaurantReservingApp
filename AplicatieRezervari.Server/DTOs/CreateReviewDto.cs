using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Http;

namespace AplicatieRezervari.Server.DTOs
{
    public class CreateReviewDto
    {
        [Required]
        public Guid ReservationId { get; set; }

        [Range(1, 5)]
        public int Rating { get; set; }

        [MaxLength(1000)]
        public string? Comment { get; set; }

        public List<IFormFile>? Images { get; set; }
    }
}