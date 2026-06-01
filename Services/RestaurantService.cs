using AplicatieRezervari.Server.Data;
using AplicatieRezervari.Server.DTOs;
using AplicatieRezervari.Server.Models;
using AplicatieRezervari.Server.Repositories;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Microsoft.AspNetCore.Hosting;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace AplicatieRezervari.Server.Services
{
    public class RestaurantService : IRestaurantService
    {
        private readonly IRestaurantRepository _restaurantRepository;
        private readonly ILogger<RestaurantService> _logger;
        private readonly ApplicationDbContext _context;
        private readonly IWebHostEnvironment _env;

        public RestaurantService(
            IRestaurantRepository restaurantRepository,
            ILogger<RestaurantService> logger,
            ApplicationDbContext context,
            IWebHostEnvironment env)
        {
            _restaurantRepository = restaurantRepository;
            _logger = logger;
            _context = context;
            _env = env;
        }

        public async Task<IEnumerable<RestaurantDto>> GetRestaurantsAsync(
            Guid cityId,
            Guid? cuisineTypeId,
            decimal? maxBudget,
            Guid? facilityId)
        {
            var restaurants = await _restaurantRepository
                .GetFilteredRestaurantsAsync(cityId, cuisineTypeId, maxBudget, facilityId);

            return restaurants.Select(MapToDto);
        }

        public async Task<RestaurantDto?> GetRestaurantByIdAsync(Guid id)
        {
            var r = await _restaurantRepository.GetRestaurantByIdAsync(id);
            if (r == null) return null;

            return MapToDto(r);
        }

        public async Task<object> SetupRestaurantAsync(RestaurantSetupInput input, string managerIdStr)
        {
            var city = await _context.Cities.FindAsync(input.CityId);

            if (city == null)
                throw new ArgumentException("City not found.");

            var restaurant = await _context.Restaurants
                .FirstOrDefaultAsync(r => r.ManagerId == managerIdStr);

            bool isNew = restaurant == null;

            if (isNew)
            {
                restaurant = new Restaurant
                {
                    Id = Guid.NewGuid(),
                    ManagerId = managerIdStr
                };

                _context.Restaurants.Add(restaurant);
            }

            restaurant.Name = input.Name;
            restaurant.Address = input.Address;
            restaurant.Description = input.Description;
            restaurant.Capacity = input.Capacity;
            restaurant.AverageBudget = input.AverageBudget;
            restaurant.Latitude = input.Latitude;
            restaurant.Longitude = input.Longitude;
            restaurant.CityId = city.Id;
            restaurant.Mood = input.Mood;
            restaurant.ExtraFacilities = input.OtherFacilities;

            var savedImageUrls = await SaveImagesToFolderAsync(input);

            if (!string.IsNullOrEmpty(savedImageUrls[0]))
            {
                DeletePhysicalFile(restaurant.Image1Url);
                restaurant.Image1Url = savedImageUrls[0];
            }

            if (!string.IsNullOrEmpty(savedImageUrls[1]))
            {
                DeletePhysicalFile(restaurant.Image2Url);
                restaurant.Image2Url = savedImageUrls[1];
            }

            if (!string.IsNullOrEmpty(savedImageUrls[2]))
            {
                DeletePhysicalFile(restaurant.Image3Url);
                restaurant.Image3Url = savedImageUrls[2];
            }

            var oldFacilities = await _context.RestaurantFacilities
                .Where(rf => rf.RestaurantId == restaurant.Id)
                .ToListAsync();

            _context.RestaurantFacilities.RemoveRange(oldFacilities);

            var oldCuisines = await _context.RestaurantCuisines
                .Where(rc => rc.RestaurantId == restaurant.Id)
                .ToListAsync();

            _context.RestaurantCuisines.RemoveRange(oldCuisines);

            foreach (var facilityId in input.StandardFacilities ?? new List<Guid>())
            {
                _context.RestaurantFacilities.Add(new RestaurantFacility
                {
                    RestaurantId = restaurant.Id,
                    FacilityId = facilityId
                });
            }

            foreach (var cuisineId in input.CuisineTypes ?? new List<Guid>())
            {
                _context.RestaurantCuisines.Add(new RestaurantCuisine
                {
                    RestaurantId = restaurant.Id,
                    CuisineTypeId = cuisineId
                });
            }

            var user = await _context.Users.FindAsync(managerIdStr);

            if (user != null)
                user.HasProfileCompleted = true;

            await _context.SaveChangesAsync();

            return new { message = "Restaurant setup completed successfully" };
        }

        private async Task<string?[]> SaveImagesToFolderAsync(RestaurantSetupInput input)
        {
            var savedImageUrls = new string?[3];
            var imageFiles = new[] { input.ImageFile1, input.ImageFile2, input.ImageFile3 };
            string uploadsFolder = Path.Combine(_env.WebRootPath, "uploads");

            if (!Directory.Exists(uploadsFolder))
                Directory.CreateDirectory(uploadsFolder);

            for (int i = 0; i < imageFiles.Length; i++)
            {
                if (imageFiles[i] != null && imageFiles[i].Length > 0)
                {
                    string fileName = $"{Guid.NewGuid()}_{Path.GetFileName(imageFiles[i].FileName)}";
                    string path = Path.Combine(uploadsFolder, fileName);

                    using var stream = new FileStream(path, FileMode.Create);
                    await imageFiles[i].CopyToAsync(stream);

                    savedImageUrls[i] = "/uploads/" + fileName;
                }
            }

            return savedImageUrls;
        }

        private void DeletePhysicalFile(string? relativeUrl)
        {
            if (string.IsNullOrEmpty(relativeUrl)) return;

            try
            {
                string fullPath = Path.Combine(_env.WebRootPath, relativeUrl.TrimStart('/'));
                if (File.Exists(fullPath))
                {
                    File.Delete(fullPath);
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to delete old restaurant image at {Url}", relativeUrl);
            }
        }

        private static RestaurantDto MapToDto(Restaurant r) => new()
        {
            Id = r.Id,
            Name = r.Name,
            Address = r.Address,
            Description = r.Description,
            Capacity = r.Capacity,
            AverageBudget = r.AverageBudget,
            CityId = r.CityId,
            CityName = r.City?.Name ?? string.Empty,
            Mood = r.Mood,

            CuisineTypeIds = r.RestaurantCuisines?.Select(rc => rc.CuisineTypeId).ToList() ?? new List<Guid>(),

            StandardFacilities = r.RestaurantFacilities?.Select(rf => rf.FacilityId).ToList() ?? new List<Guid>(),
            OtherFacilities = r.ExtraFacilities ?? string.Empty,

            Latitude = r.Latitude,
            Longitude = r.Longitude,


            Image1Url = r.Image1Url,
            Image2Url = r.Image2Url,
            Image3Url = r.Image3Url
        };

        public async Task<RestaurantDto?> GetRestaurantByManagerIdAsync(string managerIdStr)
        {
            var r = await _context.Restaurants
                .Include(r => r.City)
                .Include(r => r.RestaurantCuisines).ThenInclude(rc => rc.CuisineType)
                .Include(r => r.RestaurantFacilities).ThenInclude(rf => rf.Facility)
                .FirstOrDefaultAsync(r => r.ManagerId == managerIdStr);

            if (r == null) 
                return null;

            return MapToDto(r);
        }

        public async Task<IEnumerable<object>> GetCuisinesAsync()
        {
            return await _context.CuisineTypes
                .Select(c => new { id = c.Id, name = c.Name })
                .ToListAsync();
        }

        public async Task<IEnumerable<object>> GetFacilitiesAsync()
        {
            return await _context.Facilities
                .Select(f => new { id = f.Id, name = f.Name })
                .ToListAsync();
        }
    }
}