using System.ComponentModel.DataAnnotations;

namespace AplicatieRezervari.Server.Models
{
    public class MenuType
    {
        [Key]
        public Guid Id { get; set; }

        [Required]
        public string Code { get; set; } = string.Empty;

        [Required]
        public string Name { get; set; } = string.Empty;

        public string? Description { get; set; }

        public bool IsActive { get; set; } = true;

        public virtual ICollection<RestaurantEventMenuOption> RestaurantEventMenuOptions { get; set; } = new List<RestaurantEventMenuOption>();
    }
}