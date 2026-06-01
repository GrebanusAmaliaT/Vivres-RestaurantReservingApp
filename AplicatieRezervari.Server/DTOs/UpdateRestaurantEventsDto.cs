using System.ComponentModel.DataAnnotations;

namespace AplicatieRezervari.Server.DTOs
{
    public class UpdateRestaurantEventsDto
    {
        public bool AcceptsEvents { get; set; }

        public List<UpdateRestaurantEventOptionDto> EventOptions { get; set; } = new();
    }

    public class UpdateRestaurantEventOptionDto
    {
        [Required]
        public Guid EventTypeId { get; set; }

        public bool IsEnabled { get; set; }

        [Range(0, 100000)]
        public decimal PricePerPerson { get; set; }

        [Range(1, 10000)]
        public int MinPeople { get; set; }

        public int? MaxPeople { get; set; }

        public string? Details { get; set; }
    }
}