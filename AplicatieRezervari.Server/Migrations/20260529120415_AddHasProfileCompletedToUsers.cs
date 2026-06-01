using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AplicatieRezervari.Server.Migrations
{
    /// <inheritdoc />
    public partial class AddHasProfileCompletedToUsers : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Image1Url",
                table: "Restaurants",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Image2Url",
                table: "Restaurants",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Image3Url",
                table: "Restaurants",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "HasProfileCompleted",
                table: "AspNetUsers",
                type: "bit",
                nullable: false,
                defaultValue: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Image1Url",
                table: "Restaurants");

            migrationBuilder.DropColumn(
                name: "Image2Url",
                table: "Restaurants");

            migrationBuilder.DropColumn(
                name: "Image3Url",
                table: "Restaurants");

            migrationBuilder.DropColumn(
                name: "HasProfileCompleted",
                table: "AspNetUsers");
        }
    }
}
