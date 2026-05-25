using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AplicatieRezervari.Server.Migrations
{
    /// <inheritdoc />
    public partial class AddCoordinatesAndAdvancedAvailabilityToRestaurant : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "AcceptsEvents",
                table: "Restaurants",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<decimal>(
                name: "AnniversaryMenuPricePerPerson",
                table: "Restaurants",
                type: "decimal(18,2)",
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "BaptismMenuPricePerPerson",
                table: "Restaurants",
                type: "decimal(18,2)",
                nullable: true);

            migrationBuilder.AddColumn<TimeSpan>(
                name: "ClosingTime",
                table: "Restaurants",
                type: "time",
                nullable: false,
                defaultValue: new TimeSpan(0, 0, 0, 0, 0));

            migrationBuilder.AddColumn<int>(
                name: "DefaultReservationDurationInHours",
                table: "Restaurants",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<double>(
                name: "Latitude",
                table: "Restaurants",
                type: "float",
                nullable: true);

            migrationBuilder.AddColumn<double>(
                name: "Longitude",
                table: "Restaurants",
                type: "float",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "MinPeopleForEvents",
                table: "Restaurants",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<TimeSpan>(
                name: "OpeningTime",
                table: "Restaurants",
                type: "time",
                nullable: false,
                defaultValue: new TimeSpan(0, 0, 0, 0, 0));

            migrationBuilder.AddColumn<decimal>(
                name: "WeddingMenuPricePerPerson",
                table: "Restaurants",
                type: "decimal(18,2)",
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "EstimatedTotalCost",
                table: "Reservations",
                type: "decimal(18,2)",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<string>(
                name: "EventMenuType",
                table: "Reservations",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "RestaurantTableId",
                table: "Reservations",
                type: "uniqueidentifier",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "Type",
                table: "Reservations",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateTable(
                name: "RestaurantTables",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    TableNumber = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Capacity = table.Column<int>(type: "int", nullable: false),
                    RestaurantId = table.Column<Guid>(type: "uniqueidentifier", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_RestaurantTables", x => x.Id);
                    table.ForeignKey(
                        name: "FK_RestaurantTables_Restaurants_RestaurantId",
                        column: x => x.RestaurantId,
                        principalTable: "Restaurants",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Reviews",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Rating = table.Column<int>(type: "int", nullable: false),
                    Comment = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    RestaurantId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    UserId = table.Column<string>(type: "nvarchar(450)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Reviews", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Reviews_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Reviews_Restaurants_RestaurantId",
                        column: x => x.RestaurantId,
                        principalTable: "Restaurants",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Reservations_RestaurantTableId",
                table: "Reservations",
                column: "RestaurantTableId");

            migrationBuilder.CreateIndex(
                name: "IX_RestaurantTables_RestaurantId",
                table: "RestaurantTables",
                column: "RestaurantId");

            migrationBuilder.CreateIndex(
                name: "IX_Reviews_RestaurantId",
                table: "Reviews",
                column: "RestaurantId");

            migrationBuilder.CreateIndex(
                name: "IX_Reviews_UserId",
                table: "Reviews",
                column: "UserId");

            migrationBuilder.AddForeignKey(
                name: "FK_Reservations_RestaurantTables_RestaurantTableId",
                table: "Reservations",
                column: "RestaurantTableId",
                principalTable: "RestaurantTables",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Reservations_RestaurantTables_RestaurantTableId",
                table: "Reservations");

            migrationBuilder.DropTable(
                name: "RestaurantTables");

            migrationBuilder.DropTable(
                name: "Reviews");

            migrationBuilder.DropIndex(
                name: "IX_Reservations_RestaurantTableId",
                table: "Reservations");

            migrationBuilder.DropColumn(
                name: "AcceptsEvents",
                table: "Restaurants");

            migrationBuilder.DropColumn(
                name: "AnniversaryMenuPricePerPerson",
                table: "Restaurants");

            migrationBuilder.DropColumn(
                name: "BaptismMenuPricePerPerson",
                table: "Restaurants");

            migrationBuilder.DropColumn(
                name: "ClosingTime",
                table: "Restaurants");

            migrationBuilder.DropColumn(
                name: "DefaultReservationDurationInHours",
                table: "Restaurants");

            migrationBuilder.DropColumn(
                name: "Latitude",
                table: "Restaurants");

            migrationBuilder.DropColumn(
                name: "Longitude",
                table: "Restaurants");

            migrationBuilder.DropColumn(
                name: "MinPeopleForEvents",
                table: "Restaurants");

            migrationBuilder.DropColumn(
                name: "OpeningTime",
                table: "Restaurants");

            migrationBuilder.DropColumn(
                name: "WeddingMenuPricePerPerson",
                table: "Restaurants");

            migrationBuilder.DropColumn(
                name: "EstimatedTotalCost",
                table: "Reservations");

            migrationBuilder.DropColumn(
                name: "EventMenuType",
                table: "Reservations");

            migrationBuilder.DropColumn(
                name: "RestaurantTableId",
                table: "Reservations");

            migrationBuilder.DropColumn(
                name: "Type",
                table: "Reservations");
        }
    }
}
