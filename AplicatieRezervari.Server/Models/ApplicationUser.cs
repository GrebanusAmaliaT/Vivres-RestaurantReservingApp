using Microsoft.AspNetCore.Identity;

namespace AplicatieRezervari.Server.Models
{
    public class ApplicationUser : IdentityUser
    {
        public Guid? CityId { get; set; }
        public virtual City? City { get; set; }
        public string? FullName { get; set; }
        public bool HasProfileCompleted { get; internal set; }
    }
}