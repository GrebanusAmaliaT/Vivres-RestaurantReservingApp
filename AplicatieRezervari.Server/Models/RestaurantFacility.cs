namespace AplicatieRezervari.Server.Models
{
    public class RestaurantFacility
    {
        public Guid RestaurantId { get; set; }
        public Restaurant Restaurant { get; set; } = default!;  

        public Guid FacilityId { get; set; }
        public Facility Facility { get; set; } = default!;
    }
}
