using System;
using System.Collections.Generic;
using AplicatieRezervari.Server.Models;

namespace AplicatieRezervari.Server.DTOs
{
    public class RestaurantDto
    {
        public Guid Id { get; set; }
        public string Name { get; set; } = null!;
        public string Address { get; set; } = null!;
        public string Description { get; set; } = null!;
        public int Capacity { get; set; }
        public decimal AverageBudget { get; set; }

        public Guid CityId { get; set; }
        public string CityName { get; set; } = null!;

        public double? Latitude { get; set; }
        public double? Longitude { get; set; }

        public RestaurantMood Mood { get; set; }

        public List<Guid> CuisineTypeIds { get; set; } = new();
        public List<string> CuisineTypes { get; set; } = new();

        public List<Guid> StandardFacilities { get; set; } = new();
        public string OtherFacilities { get; set; } = string.Empty;

        public string? Image1Url { get; set; }
        public string? Image2Url { get; set; }
        public string? Image3Url { get; set; }


        public TimeSpan OpeningTime { get; set; }
        public TimeSpan ClosingTime { get; set; }
        public double DefaultReservationDurationInHours { get; set; }
    }
}