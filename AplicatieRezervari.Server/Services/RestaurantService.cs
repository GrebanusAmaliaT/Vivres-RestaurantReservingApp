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

            if (input.OpeningTime >= input.ClosingTime)
            {
                throw new ArgumentException("Ora de deschidere trebuie sa fie inaintea orei de inchidere.");
            }

            restaurant.OpeningTime = input.OpeningTime;
            restaurant.ClosingTime = input.ClosingTime;
            restaurant.DefaultReservationDurationInHours = input.DefaultReservationDurationInHours;

            var savedImageUrls = await SaveImagesToFolderAsync(input);

            await EnsureDefaultTablesAsync(restaurant);

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

        private async Task EnsureDefaultTablesAsync(Restaurant restaurant)
        {
            bool hasTables = await _context.RestaurantTables
                .AnyAsync(t => t.RestaurantId == restaurant.Id);

            if (hasTables)
            {
                return;
            }

            int remainingCapacity = restaurant.Capacity;
            int tableNumber = 1;

            while (remainingCapacity > 0)
            {
                int tableCapacity;

                if (remainingCapacity >= 8)
                {
                    tableCapacity = 8;
                }
                else if (remainingCapacity >= 6)
                {
                    tableCapacity = 6;
                }
                else if (remainingCapacity >= 4)
                {
                    tableCapacity = 4;
                }
                else if (remainingCapacity >= 2)
                {
                    tableCapacity = 2;
                }
                else
                {
                    tableCapacity = 1;
                }

                _context.RestaurantTables.Add(new RestaurantTable
                {
                    Id = Guid.NewGuid(),
                    RestaurantId = restaurant.Id,
                    TableNumber = $"Masa {tableNumber}",
                    Capacity = tableCapacity
                });

                remainingCapacity -= tableCapacity;
                tableNumber++;
            }
        }
        public async Task<IEnumerable<EventTypeDto>> GetEventTypesAsync()
        {
            return await _context.EventTypes
                .Where(e => e.IsActive)
                .OrderBy(e => e.Name)
                .Select(e => new EventTypeDto
                {
                    Id = e.Id,
                    Code = e.Code,
                    Name = e.Name,
                    Description = e.Description
                })
                .ToListAsync();
        }

        public async Task<RestaurantEventSettingsDto> GetMyEventOptionsAsync(string managerId)
        {
            var restaurant = await _context.Restaurants
                .Include(r => r.EventOptions)
                    .ThenInclude(e => e.EventType)
                .Include(r => r.EventOptions)
                    .ThenInclude(e => e.MenuOptions)
                        .ThenInclude(m => m.MenuType)
                .FirstOrDefaultAsync(r => r.ManagerId == managerId);

            if (restaurant == null)
            {
                throw new ArgumentException("Restaurantul nu exista.");
            }

            var eventTypes = await _context.EventTypes
                .Where(e => e.IsActive)
                .OrderBy(e => e.Name)
                .ToListAsync();

            var menuTypes = await _context.MenuTypes
                .Where(m => m.IsActive)
                .OrderBy(m => m.Name)
                .ToListAsync();

            var eventOptions = eventTypes.Select(eventType =>
            {
                var option = restaurant.EventOptions
                    .FirstOrDefault(o => o.EventTypeId == eventType.Id);

                var menuOptions = menuTypes.Select(menuType =>
                {
                    var existingMenuOption = option?.MenuOptions
                        .FirstOrDefault(m => m.MenuTypeId == menuType.Id);

                    return new RestaurantEventMenuOptionDto
                    {
                        Id = existingMenuOption?.Id ?? Guid.Empty,
                        MenuTypeId = menuType.Id,
                        MenuTypeCode = menuType.Code,
                        MenuTypeName = menuType.Name,
                        IsEnabled = existingMenuOption?.IsEnabled ?? false,
                        PricePerPerson = existingMenuOption?.PricePerPerson ?? 0,
                        Details = existingMenuOption?.Details
                    };
                }).ToList();

                return new RestaurantEventOptionDto
                {
                    Id = option?.Id ?? Guid.Empty,
                    EventTypeId = eventType.Id,
                    EventTypeCode = eventType.Code,
                    EventTypeName = eventType.Name,
                    IsEnabled = option?.IsEnabled ?? false,
                    PricePerPerson = option?.PricePerPerson ?? 0,
                    MinPeople = option?.MinPeople ?? 1,
                    MaxPeople = option?.MaxPeople,
                    Details = option?.Details,
                    MenuOptions = menuOptions
                };
            }).ToList();

            return new RestaurantEventSettingsDto
            {
                AcceptsEvents = restaurant.AcceptsEvents,
                EventOptions = eventOptions
            };
        }
        public async Task UpdateMyEventOptionsAsync(string managerId, UpdateRestaurantEventsDto dto)
        {
            var restaurant = await _context.Restaurants
                .Include(r => r.EventOptions)
                .FirstOrDefaultAsync(r => r.ManagerId == managerId);

            if (restaurant == null)
            {
                throw new ArgumentException("Restaurantul nu exista.");
            }

            restaurant.AcceptsEvents = dto.AcceptsEvents;

            foreach (var optionDto in dto.EventOptions)
            {
                var eventTypeExists = await _context.EventTypes
                    .AnyAsync(e => e.Id == optionDto.EventTypeId && e.IsActive);

                if (!eventTypeExists)
                {
                    continue;
                }

                var existingOption = restaurant.EventOptions
                    .FirstOrDefault(o => o.EventTypeId == optionDto.EventTypeId);

                if (existingOption == null)
                {
                    existingOption = new RestaurantEventOption
                    {
                        Id = Guid.NewGuid(),
                        RestaurantId = restaurant.Id,
                        EventTypeId = optionDto.EventTypeId
                    };

                    _context.RestaurantEventOptions.Add(existingOption);
                }

                existingOption.IsEnabled = dto.AcceptsEvents && optionDto.IsEnabled;
                existingOption.PricePerPerson = optionDto.PricePerPerson;
                existingOption.MinPeople = optionDto.MinPeople;
                existingOption.MaxPeople = optionDto.MaxPeople;
                existingOption.Details = optionDto.Details;

                foreach (var menuDto in optionDto.MenuOptions)
                {
                    var menuTypeExists = await _context.MenuTypes
                        .AnyAsync(m => m.Id == menuDto.MenuTypeId && m.IsActive);

                    if (!menuTypeExists)
                    {
                        continue;
                    }

                    var existingMenuOption = existingOption.MenuOptions
                        .FirstOrDefault(m => m.MenuTypeId == menuDto.MenuTypeId);

                    if (existingMenuOption == null)
                    {
                        existingMenuOption = new RestaurantEventMenuOption
                        {
                            Id = Guid.NewGuid(),
                            RestaurantEventOptionId = existingOption.Id,
                            MenuTypeId = menuDto.MenuTypeId
                        };

                        _context.RestaurantEventMenuOptions.Add(existingMenuOption);
                    }

                    existingMenuOption.IsEnabled =
                        dto.AcceptsEvents &&
                        existingOption.IsEnabled &&
                        menuDto.IsEnabled;

                    existingMenuOption.PricePerPerson = menuDto.PricePerPerson;
                    existingMenuOption.Details = menuDto.Details;
                }
            }

            if (!dto.AcceptsEvents)
            {
                foreach (var option in restaurant.EventOptions)
                {
                    option.IsEnabled = false;
                }
            }

            await _context.SaveChangesAsync();
        }
        public async Task<IEnumerable<EventRestaurantListingDto>> GetEventRestaurantsAsync(
            Guid? cityId,
            Guid? eventTypeId,
            int? numberOfPeople,
            decimal? maxPricePerPerson,
            List<Guid>? menuTypeIds)
        {
            var restaurants = await _context.Restaurants
                .Include(r => r.City)
                .Include(r => r.EventOptions)
                    .ThenInclude(option => option.EventType)
                .Include(r => r.EventOptions)
                    .ThenInclude(option => option.MenuOptions)
                        .ThenInclude(menu => menu.MenuType)
                .Where(r => r.AcceptsEvents)
                .ToListAsync();

            if (cityId.HasValue)
            {
                restaurants = restaurants
                    .Where(r => r.CityId == cityId.Value)
                    .ToList();
            }

            var selectedMenuTypeIds = menuTypeIds ?? new List<Guid>();

            var result = restaurants
                .Select(restaurant =>
                {
                    var enabledOptions = restaurant.EventOptions
                        .Where(option => option.IsEnabled && option.EventType.IsActive)
                        .ToList();

                    if (eventTypeId.HasValue)
                    {
                        enabledOptions = enabledOptions
                            .Where(option => option.EventTypeId == eventTypeId.Value)
                            .ToList();
                    }

                    if (numberOfPeople.HasValue)
                    {
                        enabledOptions = enabledOptions
                            .Where(option =>
                                numberOfPeople.Value >= option.MinPeople &&
                                (!option.MaxPeople.HasValue || numberOfPeople.Value <= option.MaxPeople.Value))
                            .ToList();
                    }

                    if (selectedMenuTypeIds.Any())
                    {
                        enabledOptions = enabledOptions
                            .Where(option =>
                                selectedMenuTypeIds.All(menuTypeId =>
                                    option.MenuOptions.Any(menu =>
                                        menu.MenuTypeId == menuTypeId &&
                                        menu.IsEnabled)))
                            .ToList();
                    }

                    if (maxPricePerPerson.HasValue)
                    {
                        enabledOptions = enabledOptions
                            .Where(option =>
                            {
                                var enabledMenus = option.MenuOptions
                                    .Where(menu => menu.IsEnabled)
                                    .ToList();

                                if (!enabledMenus.Any())
                                {
                                    return option.PricePerPerson <= maxPricePerPerson.Value;
                                }

                                return enabledMenus.Any(menu => menu.PricePerPerson <= maxPricePerPerson.Value);
                            })
                            .ToList();
                    }

                    if (!enabledOptions.Any())
                    {
                        return null;
                    }

                    decimal GetOptionMinPrice(RestaurantEventOption option)
                    {
                        var enabledMenus = option.MenuOptions
                            .Where(menu => menu.IsEnabled)
                            .ToList();

                        if (enabledMenus.Any())
                        {
                            return enabledMenus.Min(menu => menu.PricePerPerson);
                        }

                        return option.PricePerPerson;
                    }

                    return new EventRestaurantListingDto
                    {
                        Id = restaurant.Id,
                        Name = restaurant.Name,
                        Address = restaurant.Address,
                        Description = restaurant.Description,
                        CityId = restaurant.CityId,
                        CityName = restaurant.City?.Name ?? string.Empty,
                        Capacity = restaurant.Capacity,
                        AverageBudget = restaurant.AverageBudget,
                        Image1Url = restaurant.Image1Url,
                        Image2Url = restaurant.Image2Url,
                        Image3Url = restaurant.Image3Url,
                        MinEventPricePerPerson = enabledOptions.Min(GetOptionMinPrice),

                        EventOptions = enabledOptions
                            .OrderBy(GetOptionMinPrice)
                            .Select(option => new RestaurantEventOptionPublicDto
                            {
                                EventTypeId = option.EventTypeId,
                                EventTypeCode = option.EventType.Code,
                                EventTypeName = option.EventType.Name,
                                PricePerPerson = GetOptionMinPrice(option),
                                MinPeople = option.MinPeople,
                                MaxPeople = option.MaxPeople,
                                Details = option.Details,
                                MenuOptions = option.MenuOptions
                                    .Where(menu => menu.IsEnabled)
                                    .OrderBy(menu => menu.MenuType.Name)
                                    .Select(menu => new RestaurantEventMenuOptionPublicDto
                                    {
                                        Id = menu.Id,
                                        MenuTypeId = menu.MenuTypeId,
                                        MenuTypeCode = menu.MenuType.Code,
                                        MenuTypeName = menu.MenuType.Name,
                                        PricePerPerson = menu.PricePerPerson,
                                        Details = menu.Details
                                    })
                                    .ToList()
                            })
                            .ToList()
                    };
                })
                .Where(dto => dto != null)
                .Cast<EventRestaurantListingDto>()
                .OrderBy(dto => dto.MinEventPricePerPerson)
                .ToList();

            return result;
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

        public async Task<IEnumerable<MenuTypeDto>> GetMenuTypesAsync()
        {
            return await _context.MenuTypes
                .Where(m => m.IsActive)
                .OrderBy(m => m.Name)
                .Select(m => new MenuTypeDto
                {
                    Id = m.Id,
                    Code = m.Code,
                    Name = m.Name,
                    Description = m.Description
                })
                .ToListAsync();
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

            OpeningTime = r.OpeningTime,
            ClosingTime = r.ClosingTime,
            DefaultReservationDurationInHours = r.DefaultReservationDurationInHours,

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