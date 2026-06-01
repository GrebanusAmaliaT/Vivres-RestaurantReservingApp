using AplicatieRezervari.Server.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace AplicatieRezervari.Server.Data
{
    public static class DbSeeder
    {
        public static async Task SeedDataAsync(
            ApplicationDbContext context,
            RoleManager<IdentityRole> roleManager,
            UserManager<ApplicationUser> userManager)
        {
            context.Database.EnsureCreated();

            var roles = new List<string>
            {
                "RestaurantManager",
                "Client"
            };

            foreach (var role in roles)
            {
                if (!await roleManager.RoleExistsAsync(role))
                {
                    await roleManager.CreateAsync(new IdentityRole(role));
                }
            }

            var cityNames = new List<string>
            {
                "Bucuresti",
                "Cluj-Napoca",
                "Timisoara",
                "Iasi",
                "Brasov",
                "Craiova",
                "Sibiu"
            };

            foreach (var cityName in cityNames)
            {
                bool exists = await context.Cities
                    .AnyAsync(c => c.Name == cityName);

                if (!exists)
                {
                    context.Cities.Add(new City
                    {
                        Id = Guid.NewGuid(),
                        Name = cityName
                    });
                }
            }

            var cuisineNames = new List<string>
            {
                "Traditionala",
                "Romaneasca",
                "Italiana",
                "Asiatica",
                "Mexicana",
                "Greceasca",
                "Frantuzeasca",
                "Libaneza",
                "Fusion",
                "Internationala"
            };

            foreach (var cuisineName in cuisineNames)
            {
                bool exists = await context.CuisineTypes
                    .AnyAsync(c => c.Name == cuisineName);

                if (!exists)
                {
                    context.CuisineTypes.Add(new CuisineType
                    {
                        Id = Guid.NewGuid(),
                        Name = cuisineName
                    });
                }
            }

            var facilityNames = new List<string>
            {
                "Ring de dans",
                "Parcare privata",
                "Muzica live",
                "Zona fumatori",
                "Terasa",
                "Wi-Fi",
                "Aer conditionat",
                "Loc de joaca pentru copii",
                "Acces persoane cu dizabilitati",
                "Pet friendly",
                "Se accepta evenimente private"
            };

            foreach (var facilityName in facilityNames)
            {
                bool exists = await context.Facilities
                    .AnyAsync(f => f.Name == facilityName);

                if (!exists)
                {
                    context.Facilities.Add(new Facility
                    {
                        Id = Guid.NewGuid(),
                        Name = facilityName
                    });
                }
            }

            await context.SaveChangesAsync();
        }
    }
}