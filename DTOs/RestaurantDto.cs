namespace AplicatieRezervari.Server.DTOs
{
    public class RestaurantDto
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public string Address { get; set; }
        public string Description { get; set; }
        public int Capacity { get; set; }
        public decimal AverageBudget { get; set; }
        public string CityName { get; set; }

        public double? Latitude { get; set; }
        public double? Longitude { get; set; }

        public List<string> CuisineTypes { get; set; }
        public List<string> Facilities { get; set; }
    }
}