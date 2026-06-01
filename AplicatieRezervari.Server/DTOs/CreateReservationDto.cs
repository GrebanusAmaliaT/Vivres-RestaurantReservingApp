using System.ComponentModel.DataAnnotations;

namespace AplicatieRezervari.Server.DTOs
{
    public class CreateReservationDto
    {
        public Guid RestaurantId { get; set; }
        public DateTime ReservationDate { get; set; }

        [Range(1, 100, ErrorMessage = "Numarul de persoane trebuie sa fie intre 1 si 100.")]
        public int NumberOfPeople { get; set; }
        
        public string? SpecialRequests { get; set; }

        public bool IsEvent { get; set; }
        public string? EventMenuType { get; set; }
    }
}