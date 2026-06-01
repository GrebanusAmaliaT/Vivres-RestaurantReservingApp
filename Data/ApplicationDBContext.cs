using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using AplicatieRezervari.Server.Models;

namespace AplicatieRezervari.Server.Data;

public class ApplicationDbContext : IdentityDbContext<ApplicationUser>
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options)
    {
    }

    public DbSet<Restaurant> Restaurants { get; set; } = default!;
    public DbSet<City> Cities { get; set; } = default!;
    public DbSet<Reservation> Reservations { get; set; } = default!;
    public DbSet<Facility> Facilities { get; set; } = default!;
    public DbSet<CuisineType> CuisineTypes { get; set; } = default!;
    public DbSet<RestaurantFacility> RestaurantFacilities { get; set; } = default!;
    public DbSet<RestaurantCuisine> RestaurantCuisines { get; set; } = default!;
    public DbSet<Review> Reviews { get; set; } = default!;
    public DbSet<RestaurantTable> RestaurantTables { get; set; } = default!;
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<Restaurant>()
            .Property(r => r.AverageBudget)
            .HasColumnType("decimal(18,2)");


        modelBuilder.Entity<RestaurantFacility>()
    .HasKey(rf => new { rf.RestaurantId, rf.FacilityId });

        modelBuilder.Entity<RestaurantFacility>()
            .HasOne(rf => rf.Restaurant)
            .WithMany(r => r.RestaurantFacilities)
            .HasForeignKey(rf => rf.RestaurantId);

        modelBuilder.Entity<RestaurantFacility>()
            .HasOne(rf => rf.Facility)
            .WithMany(f => f.RestaurantFacilities)
            .HasForeignKey(rf => rf.FacilityId);


        modelBuilder.Entity<RestaurantCuisine>()
            .HasKey(rc => new { rc.RestaurantId, rc.CuisineTypeId });

        modelBuilder.Entity<RestaurantCuisine>()
            .HasOne(rc => rc.Restaurant)
            .WithMany(r => r.RestaurantCuisines)
            .HasForeignKey(rc => rc.RestaurantId);

        modelBuilder.Entity<RestaurantCuisine>()
            .HasOne(rc => rc.CuisineType)
            .WithMany(c => c.RestaurantCuisines)
            .HasForeignKey(rc => rc.CuisineTypeId);
    }
}