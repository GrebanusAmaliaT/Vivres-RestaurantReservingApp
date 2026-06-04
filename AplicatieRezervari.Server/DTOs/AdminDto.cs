namespace AplicatieRezervari.Server.DTOs
{
    public class AdminUserDto
    {
        public string Id { get; set; } = string.Empty;

        public string Email { get; set; } = string.Empty;

        public string UserName { get; set; } = string.Empty;

        public bool HasProfileCompleted { get; set; }

        public IList<string> Roles { get; set; } = new List<string>();
    }

    public class AdminRestaurantDto
    {
        public Guid Id { get; set; }

        public string Name { get; set; } = string.Empty;

        public string Address { get; set; } = string.Empty;

        public string CityName { get; set; } = string.Empty;

        public int Capacity { get; set; }

        public bool AcceptsEvents { get; set; }

        public string ManagerId { get; set; } = string.Empty;
    }
}