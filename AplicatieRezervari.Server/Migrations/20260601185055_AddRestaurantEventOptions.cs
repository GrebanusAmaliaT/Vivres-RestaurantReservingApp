using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AplicatieRezervari.Server.Migrations
{
    /// <inheritdoc />
    public partial class AddRestaurantEventOptions : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "EventTypeId",
                table: "Reservations",
                type: "uniqueidentifier",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "EventTypes",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Code = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    IsActive = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_EventTypes", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "RestaurantEventOptions",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    RestaurantId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    EventTypeId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    IsEnabled = table.Column<bool>(type: "bit", nullable: false),
                    PricePerPerson = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    MinPeople = table.Column<int>(type: "int", nullable: false),
                    MaxPeople = table.Column<int>(type: "int", nullable: true),
                    Details = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_RestaurantEventOptions", x => x.Id);
                    table.ForeignKey(
                        name: "FK_RestaurantEventOptions_EventTypes_EventTypeId",
                        column: x => x.EventTypeId,
                        principalTable: "EventTypes",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_RestaurantEventOptions_Restaurants_RestaurantId",
                        column: x => x.RestaurantId,
                        principalTable: "Restaurants",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Reservations_EventTypeId",
                table: "Reservations",
                column: "EventTypeId");

            migrationBuilder.CreateIndex(
                name: "IX_RestaurantEventOptions_EventTypeId",
                table: "RestaurantEventOptions",
                column: "EventTypeId");

            migrationBuilder.CreateIndex(
                name: "IX_RestaurantEventOptions_RestaurantId_EventTypeId",
                table: "RestaurantEventOptions",
                columns: new[] { "RestaurantId", "EventTypeId" },
                unique: true);

            migrationBuilder.AddForeignKey(
                name: "FK_Reservations_EventTypes_EventTypeId",
                table: "Reservations",
                column: "EventTypeId",
                principalTable: "EventTypes",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Reservations_EventTypes_EventTypeId",
                table: "Reservations");

            migrationBuilder.DropTable(
                name: "RestaurantEventOptions");

            migrationBuilder.DropTable(
                name: "EventTypes");

            migrationBuilder.DropIndex(
                name: "IX_Reservations_EventTypeId",
                table: "Reservations");

            migrationBuilder.DropColumn(
                name: "EventTypeId",
                table: "Reservations");
        }
    }
}
