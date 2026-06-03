namespace AplicatieRezervari.Server.DTOs
{
    public class MenuTypeDto
    {
        public Guid Id { get; set; }

        public string Code { get; set; } = string.Empty;

        public string Name { get; set; } = string.Empty;

        public string? Description { get; set; }
    }
}