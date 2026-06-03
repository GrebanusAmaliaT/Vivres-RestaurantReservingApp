namespace AplicatieRezervari.Server.Models
{
    public class ReservationEventMenuSelection
    {
        public Guid Id { get; set; }

        public Guid ReservationId { get; set; }
        public virtual Reservation Reservation { get; set; } = default!;

        public Guid RestaurantEventMenuOptionId { get; set; }
        public virtual RestaurantEventMenuOption RestaurantEventMenuOption { get; set; } = default!;

        public int Quantity { get; set; }

        public decimal PricePerPersonAtRequest { get; set; }

        public string MenuNameSnapshot { get; set; } = string.Empty;
    }
}
