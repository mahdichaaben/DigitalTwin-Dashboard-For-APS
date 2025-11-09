using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace backend_dash.Migrations
{
    /// <inheritdoc />
    public partial class updatedSlot : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "StorageSlots",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    SlotName = table.Column<string>(type: "character varying(10)", maxLength: 10, nullable: false),
                    WorkpieceId = table.Column<string>(type: "text", nullable: true),
                    StorageModuleId = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_StorageSlots", x => x.Id);
                    table.ForeignKey(
                        name: "FK_StorageSlots_StorageModules_StorageModuleId",
                        column: x => x.StorageModuleId,
                        principalTable: "StorageModules",
                        principalColumn: "SerialNumber",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_StorageSlots_Workpieces_WorkpieceId",
                        column: x => x.WorkpieceId,
                        principalTable: "Workpieces",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                });

            migrationBuilder.CreateIndex(
                name: "IX_StorageSlots_StorageModuleId",
                table: "StorageSlots",
                column: "StorageModuleId");

            migrationBuilder.CreateIndex(
                name: "IX_StorageSlots_WorkpieceId",
                table: "StorageSlots",
                column: "WorkpieceId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "StorageSlots");
        }
    }
}
