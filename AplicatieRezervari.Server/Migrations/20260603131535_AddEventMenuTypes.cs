using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AplicatieRezervari.Server.Migrations
{
    /// <inheritdoc />
    public partial class AddEventMenuTypes : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "MenuTypes",
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
                    table.PrimaryKey("PK_MenuTypes", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "RestaurantEventMenuOptions",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    RestaurantEventOptionId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    MenuTypeId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    IsEnabled = table.Column<bool>(type: "bit", nullable: false),
                    PricePerPerson = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    Details = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_RestaurantEventMenuOptions", x => x.Id);
                    table.ForeignKey(
                        name: "FK_RestaurantEventMenuOptions_MenuTypes_MenuTypeId",
                        column: x => x.MenuTypeId,
                        principalTable: "MenuTypes",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_RestaurantEventMenuOptions_RestaurantEventOptions_RestaurantEventOptionId",
                        column: x => x.RestaurantEventOptionId,
                        principalTable: "RestaurantEventOptions",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ReservationEventMenuSelections",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    ReservationId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    RestaurantEventMenuOptionId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Quantity = table.Column<int>(type: "int", nullable: false),
                    PricePerPersonAtRequest = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    MenuNameSnapshot = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ReservationEventMenuSelections", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ReservationEventMenuSelections_Reservations_ReservationId",
                        column: x => x.ReservationId,
                        principalTable: "Reservations",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ReservationEventMenuSelections_RestaurantEventMenuOptions_RestaurantEventMenuOptionId",
                        column: x => x.RestaurantEventMenuOptionId,
                        principalTable: "RestaurantEventMenuOptions",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_ReservationEventMenuSelections_ReservationId",
                table: "ReservationEventMenuSelections",
                column: "ReservationId");

            migrationBuilder.CreateIndex(
                name: "IX_ReservationEventMenuSelections_RestaurantEventMenuOptionId",
                table: "ReservationEventMenuSelections",
                column: "RestaurantEventMenuOptionId");

            migrationBuilder.CreateIndex(
                name: "IX_RestaurantEventMenuOptions_MenuTypeId",
                table: "RestaurantEventMenuOptions",
                column: "MenuTypeId");

            migrationBuilder.CreateIndex(
                name: "IX_RestaurantEventMenuOptions_RestaurantEventOptionId_MenuTypeId",
                table: "RestaurantEventMenuOptions",
                columns: new[] { "RestaurantEventOptionId", "MenuTypeId" },
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ReservationEventMenuSelections");

            migrationBuilder.DropTable(
                name: "RestaurantEventMenuOptions");

            migrationBuilder.DropTable(
                name: "MenuTypes");
        }
    }
}
