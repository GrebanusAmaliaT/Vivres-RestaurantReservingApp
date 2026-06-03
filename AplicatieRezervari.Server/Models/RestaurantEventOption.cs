using System.ComponentModel.DataAnnotations;

namespace AplicatieRezervari.Server.Models
{
    public class RestaurantEventOption
    {
        [Key]
        public Guid Id { get; set; }

        public Guid RestaurantId { get; set; }
        public virtual Restaurant Restaurant { get; set; } = default!;

        public Guid EventTypeId { get; set; }
        public virtual EventType EventType { get; set; } = default!;

        public bool IsEnabled { get; set; }

        public decimal PricePerPerson { get; set; }

        public int MinPeople { get; set; }

        public int? MaxPeople { get; set; }

        public string? Details { get; set; }
        public virtual ICollection<RestaurantEventMenuOption> MenuOptions { get; set; } = new List<RestaurantEventMenuOption>();

    }
}