using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using AplicatieRezervari.Server.Models;

namespace AplicatieRezervari.Server.Data;

public class ApplicationDbContext : IdentityDbContext<ApplicationUser>
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options) { }
    public DbSet<Restaurant> Restaurants { get; set; } = default!;
    public DbSet<City> Cities { get; set; } = default!;
    public DbSet<Reservation> Reservations { get; set; } = default!;
    public DbSet<Facility> Facilities { get; set; } = default!;
    public DbSet<CuisineType> CuisineTypes { get; set; } = default!;
    public DbSet<RestaurantFacility> RestaurantFacilities { get; set; } = default!;
    public DbSet<RestaurantCuisine> RestaurantCuisines { get; set; } = default!;
    public DbSet<RestaurantTable> RestaurantTables { get; set; } = default!;
    public DbSet<EventType> EventTypes { get; set; } = default!;
    public DbSet<RestaurantEventOption> RestaurantEventOptions { get; set; } = default!;
    public DbSet<MenuType> MenuTypes { get; set; } = default!;
    public DbSet<RestaurantEventMenuOption> RestaurantEventMenuOptions { get; set; } = default!;
    public DbSet<ReservationEventMenuSelection> ReservationEventMenuSelections { get; set; } = default!;
    public DbSet<Review> Reviews { get; set; } = default!;
    public DbSet<ReviewImage> ReviewImages { get; set; } = default!;

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

        modelBuilder.Entity<RestaurantEventOption>()
            .Property(e => e.PricePerPerson)
            .HasColumnType("decimal(18,2)");

        modelBuilder.Entity<RestaurantEventOption>()
            .HasOne(e => e.Restaurant)
            .WithMany(r => r.EventOptions)
            .HasForeignKey(e => e.RestaurantId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<RestaurantEventOption>()
            .HasOne(e => e.EventType)
            .WithMany(t => t.RestaurantEventOptions)
            .HasForeignKey(e => e.EventTypeId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<RestaurantEventOption>()
            .HasIndex(e => new { e.RestaurantId, e.EventTypeId })
            .IsUnique();

        modelBuilder.Entity<Reservation>()
            .HasOne(r => r.EventType)
            .WithMany(e => e.Reservations)
            .HasForeignKey(r => r.EventTypeId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<RestaurantEventMenuOption>()
        .Property(m => m.PricePerPerson)
        .HasColumnType("decimal(18,2)");

        modelBuilder.Entity<RestaurantEventMenuOption>()
            .HasOne(m => m.RestaurantEventOption)
            .WithMany(o => o.MenuOptions)
            .HasForeignKey(m => m.RestaurantEventOptionId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<RestaurantEventMenuOption>()
            .HasOne(m => m.MenuType)
            .WithMany(t => t.RestaurantEventMenuOptions)
            .HasForeignKey(m => m.MenuTypeId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<RestaurantEventMenuOption>()
            .HasIndex(m => new { m.RestaurantEventOptionId, m.MenuTypeId })
            .IsUnique();

        modelBuilder.Entity<ReservationEventMenuSelection>()
            .Property(s => s.PricePerPersonAtRequest)
            .HasColumnType("decimal(18,2)");

        modelBuilder.Entity<ReservationEventMenuSelection>()
            .HasOne(s => s.Reservation)
            .WithMany(r => r.EventMenuSelections)
            .HasForeignKey(s => s.ReservationId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<ReservationEventMenuSelection>()
            .HasOne(s => s.RestaurantEventMenuOption)
            .WithMany()
            .HasForeignKey(s => s.RestaurantEventMenuOptionId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<Review>()
            .HasOne(r => r.Reservation)
            .WithOne(r => r.Review)
            .HasForeignKey<Review>(r => r.ReservationId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<Review>()
            .HasOne(r => r.Restaurant)
            .WithMany(r => r.Reviews)
            .HasForeignKey(r => r.RestaurantId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<Review>()
            .HasOne(r => r.User)
            .WithMany()
            .HasForeignKey(r => r.UserId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<ReviewImage>()
            .HasOne(i => i.Review)
            .WithMany(r => r.Images)
            .HasForeignKey(i => i.ReviewId)
            .OnDelete(DeleteBehavior.Cascade);

    }
}