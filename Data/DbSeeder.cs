using AplicatieRezervari.Server.Models;
using Microsoft.AspNetCore.Identity;

namespace AplicatieRezervari.Server.Data
{
    public static class DbSeeder
    {
        public static async Task SeedDataAsync(ApplicationDbContext context, RoleManager<IdentityRole> roleManager, UserManager<ApplicationUser> userManager)
        {
            context.Database.EnsureCreated();

            if (!roleManager.Roles.Any())
            {
                await roleManager.CreateAsync(new IdentityRole("Admin"));
                await roleManager.CreateAsync(new IdentityRole("RestaurantManager"));
                await roleManager.CreateAsync(new IdentityRole("Client"));
            }

            if (!context.Cities.Any())
            {
                var cities = new List<City>
                {
                    new City { Id = Guid.NewGuid(), Name = "Bucharest" },
                    new City { Id = Guid.NewGuid(), Name = "Cluj-Napoca" },
                    new City { Id = Guid.NewGuid(), Name = "Timisoara" }
                };
                await context.Cities.AddRangeAsync(cities);
                await context.SaveChangesAsync();
            }

            if (!context.CuisineTypes.Any())
            {
                var cuisines = new List<CuisineType>
                {
                    new CuisineType { Id = Guid.NewGuid(), Name = "Traditionala" },
                    new CuisineType { Id = Guid.NewGuid(), Name = "Asiatica" },
                    new CuisineType { Id = Guid.NewGuid(), Name = "Italiana" },
                    new CuisineType { Id = Guid.NewGuid(), Name = "Mexican" }
                };
                await context.CuisineTypes.AddRangeAsync(cuisines);
            }

            if (!context.Facilities.Any())
            {
                var facilities = new List<Facility>
                {
                    new Facility { Id = Guid.NewGuid(), Name = "Ring de dans" },
                    new Facility { Id = Guid.NewGuid(), Name = "Candy Bar" },
                    new Facility { Id = Guid.NewGuid(), Name = "Parcare privata" },
                    new Facility { Id = Guid.NewGuid(), Name = "Garderoba" }
                };
                await context.Facilities.AddRangeAsync(facilities);
            }

            await context.SaveChangesAsync();
        }
    }
}