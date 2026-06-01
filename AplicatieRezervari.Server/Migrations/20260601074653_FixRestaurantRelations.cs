using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AplicatieRezervari.Server.Migrations
{
    /// <inheritdoc />
    public partial class FixRestaurantRelations : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "ExtraFacilities",
                table: "Restaurants",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "Mood",
                table: "Restaurants",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ExtraFacilities",
                table: "Restaurants");

            migrationBuilder.DropColumn(
                name: "Mood",
                table: "Restaurants");
        }
    }
}
