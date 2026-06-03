namespace AplicatieRezervari.Server.Models
{
    public class RestaurantEventMenuOption
    {
        public Guid Id { get; set; }

        public Guid RestaurantEventOptionId { get; set; }
        public virtual RestaurantEventOption RestaurantEventOption { get; set; } = default!;

        public Guid MenuTypeId { get; set; }
        public virtual MenuType MenuType { get; set; } = default!;

        public bool IsEnabled { get; set; }

        public decimal PricePerPerson { get; set; }

        public string? Details { get; set; }
    }
}
