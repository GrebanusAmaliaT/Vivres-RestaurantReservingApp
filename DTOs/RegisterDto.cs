using System.ComponentModel.DataAnnotations;

namespace AplicatieRezervari.Server.DTOs
{
    public class RegisterDto
    {
        [Required(ErrorMessage = "Adresa de email este obligatorie.")]
        [EmailAddress(ErrorMessage = "Adresa de email nu are un format valid.")]
        public string Email { get; set; } = string.Empty;

        [Required(ErrorMessage = "Parola este obligatorie.")]
        [MinLength(6, ErrorMessage = "Parola trebuie să aibă cel puțin 6 caractere.")]
        public string Password { get; set; } = string.Empty;

        [Required(ErrorMessage = "Numele complet este obligatoriu.")]
        [StringLength(100, ErrorMessage = "Numele nu poate depăși 100 de caractere.")]
        public string FullName { get; set; } = string.Empty;

        public Guid? CityId { get; set; }

        [Required(ErrorMessage = "Rolul este obligatoriu.")]
        [RegularExpression("^(Client|RestaurantManager)$", ErrorMessage = "Rolul specificat este invalid. Trebuie să fie 'Client' sau 'Restaurant Manager'.")]
        public string Role { get; set; } = string.Empty;
    }
}