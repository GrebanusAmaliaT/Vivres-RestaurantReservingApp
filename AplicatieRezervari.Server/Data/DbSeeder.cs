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
            var eventTypes = new List<EventType>
            {
                new EventType
                {
                    Code = "wedding",
                    Name = "Wedding",
                    Description = "Weddings, large formal receptions and wedding dinners"
                },
                new EventType
                {
                    Code = "baptism",
                    Name = "Baptism",
                    Description = "Baptism parties and family celebrations"
                },
                new EventType
                {
                    Code = "anniversary",
                    Name = "Anniversary",
                    Description = "Anniversaries and birthday celebrations"
                },
                new EventType
                {
                    Code = "corporate",
                    Name = "Corporate Event",
                    Description = "Business dinners, team events and company parties"
                },
                new EventType
                {
                    Code = "memorial",
                    Name = "Memorial Meal",
                    Description = "Memorial meals and commemorative gatherings"
                },
                new EventType
                {
                    Code = "engagement",
                    Name = "Engagement Party",
                    Description = "Engagement parties and proposal celebrations"
                },
                new EventType
                {
                    Code = "graduation",
                    Name = "Graduation Party",
                    Description = "Graduation dinners and student celebrations"
                },
                new EventType
                {
                    Code = "private_party",
                    Name = "Private Party",
                    Description = "Private parties and social gatherings"
                },
                new EventType
                {
                    Code = "conference",
                    Name = "Conference",
                    Description = "Conferences, workshops and professional meetings"
                },
                new EventType
                {
                    Code = "holiday_party",
                    Name = "Holiday Party",
                    Description = "Christmas, New Year and seasonal events"
                }
            };

            foreach (var eventType in eventTypes)
            {
                bool exists = context.EventTypes.Any(e => e.Code == eventType.Code);

                if (!exists)
                {
                    context.EventTypes.Add(eventType);
                }
            }

            var menuTypes = new List<MenuType>
            {
                new MenuType
                {
                    Code = "standard",
                    Name = "Standard Menu",
                    Description = "Classic menu suitable for most events"
                },
                new MenuType
                {
                    Code = "premium",
                    Name = "Premium Menu",
                    Description = "Enhanced menu with premium dishes"
                },
                new MenuType
                {
                    Code = "vegetarian",
                    Name = "Vegetarian Menu",
                    Description = "Menu without meat"
                },
                new MenuType
                {
                    Code = "vegan",
                    Name = "Vegan Menu",
                    Description = "Fully plant-based menu"
                },
                new MenuType
                {
                    Code = "gluten_free",
                    Name = "Gluten-Free Menu",
                    Description = "Menu options without gluten"
                },
                new MenuType
                {
                    Code = "kids",
                    Name = "Kids Menu",
                    Description = "Menu designed for children"
                },
                new MenuType
                {
                    Code = "fasting",
                    Name = "Fasting / Lenten Menu",
                    Description = "Menu suitable for fasting periods"
                },
                new MenuType
                {
                    Code = "lactose_free",
                    Name = "Lactose-Free Menu",
                    Description = "Menu without lactose"
                },
                new MenuType
                {
                    Code = "pescatarian",
                    Name = "Pescatarian Menu",
                    Description = "Menu based on fish and seafood"
                },
                new MenuType
                {
                    Code = "custom",
                    Name = "Custom Menu",
                    Description = "Custom menu based on client needs"
                }
            };

            foreach (var menuType in menuTypes)
            {
                bool exists = context.MenuTypes.Any(m => m.Code == menuType.Code);

                if (!exists)
                {
                    context.MenuTypes.Add(menuType);
                }
            }

            await context.SaveChangesAsync();

            await context.SaveChangesAsync();
        }
    }
}