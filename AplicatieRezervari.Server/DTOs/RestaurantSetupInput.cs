using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Http;
using AplicatieRezervari.Server.Models;

namespace AplicatieRezervari.Server.DTOs
{
    public class RestaurantSetupInput
    {
        [Required] public string Name { get; set; } = null!;
        [Required] public string Address { get; set; } = null!;
        [Required] public string Description { get; set; } = null!;
        [Required] public int Capacity { get; set; }
        [Required] public decimal AverageBudget { get; set; }
        [Required] public Guid CityId { get; set; }

        public double? Latitude { get; set; }
        public double? Longitude { get; set; }

        [Required] public RestaurantMood Mood { get; set; }
        public List<Guid> CuisineTypes { get; set; } = new();
        public List<Guid> StandardFacilities { get; set; } = new();
        public string? OtherFacilities { get; set; }

        public IFormFile? ImageFile1 { get; set; }
        public IFormFile? ImageFile2 { get; set; }
        public IFormFile? ImageFile3 { get; set; }


        [Required]
        public TimeSpan OpeningTime { get; set; }

        [Required]
        public TimeSpan ClosingTime { get; set; }

        [Range(1.0, 2.5)]
        public double DefaultReservationDurationInHours { get; set; } = 2;
    }
}