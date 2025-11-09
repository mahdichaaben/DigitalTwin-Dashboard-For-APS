using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace backend_dash.Migrations
{
    /// <inheritdoc />
    public partial class updatedWpType : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_WorkpieceTypes_Stores_StoreSerialNumber",
                table: "WorkpieceTypes");

            migrationBuilder.DropForeignKey(
                name: "FK_WorkpieceTypes_TransportModules_TransportModuleSerialNumber",
                table: "WorkpieceTypes");

            migrationBuilder.DropTable(
                name: "WorkpieceTypeFixedModules");

            migrationBuilder.DropIndex(
                name: "IX_WorkpieceTypes_StoreSerialNumber",
                table: "WorkpieceTypes");

            migrationBuilder.DropColumn(
                name: "StoreSerialNumber",
                table: "WorkpieceTypes");

            migrationBuilder.RenameColumn(
                name: "TransportModuleSerialNumber",
                table: "WorkpieceTypes",
                newName: "DigitalModuleSerialNumber");

            migrationBuilder.RenameIndex(
                name: "IX_WorkpieceTypes_TransportModuleSerialNumber",
                table: "WorkpieceTypes",
                newName: "IX_WorkpieceTypes_DigitalModuleSerialNumber");

            migrationBuilder.AddColumn<string>(
                name: "WorkpieceTypeId",
                table: "FixedModules",
                type: "text",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "WorkpieceTypeModules",
                columns: table => new
                {
                    WorkpieceTypeId = table.Column<string>(type: "text", nullable: false),
                    FixedModuleId = table.Column<string>(type: "text", nullable: false),
                    Order = table.Column<int>(type: "integer", nullable: false, defaultValue: 0)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_WorkpieceTypeModules", x => new { x.WorkpieceTypeId, x.FixedModuleId });
                    table.ForeignKey(
                        name: "FK_WorkpieceTypeModules_FixedModules_FixedModuleId",
                        column: x => x.FixedModuleId,
                        principalTable: "FixedModules",
                        principalColumn: "SerialNumber",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_WorkpieceTypeModules_WorkpieceTypes_WorkpieceTypeId",
                        column: x => x.WorkpieceTypeId,
                        principalTable: "WorkpieceTypes",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_FixedModules_WorkpieceTypeId",
                table: "FixedModules",
                column: "WorkpieceTypeId");

            migrationBuilder.CreateIndex(
                name: "IX_WorkpieceTypeModules_FixedModuleId",
                table: "WorkpieceTypeModules",
                column: "FixedModuleId");

            migrationBuilder.AddForeignKey(
                name: "FK_FixedModules_WorkpieceTypes_WorkpieceTypeId",
                table: "FixedModules",
                column: "WorkpieceTypeId",
                principalTable: "WorkpieceTypes",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_WorkpieceTypes_DigitalModules_DigitalModuleSerialNumber",
                table: "WorkpieceTypes",
                column: "DigitalModuleSerialNumber",
                principalTable: "DigitalModules",
                principalColumn: "SerialNumber");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_FixedModules_WorkpieceTypes_WorkpieceTypeId",
                table: "FixedModules");

            migrationBuilder.DropForeignKey(
                name: "FK_WorkpieceTypes_DigitalModules_DigitalModuleSerialNumber",
                table: "WorkpieceTypes");

            migrationBuilder.DropTable(
                name: "WorkpieceTypeModules");

            migrationBuilder.DropIndex(
                name: "IX_FixedModules_WorkpieceTypeId",
                table: "FixedModules");

            migrationBuilder.DropColumn(
                name: "WorkpieceTypeId",
                table: "FixedModules");

            migrationBuilder.RenameColumn(
                name: "DigitalModuleSerialNumber",
                table: "WorkpieceTypes",
                newName: "TransportModuleSerialNumber");

            migrationBuilder.RenameIndex(
                name: "IX_WorkpieceTypes_DigitalModuleSerialNumber",
                table: "WorkpieceTypes",
                newName: "IX_WorkpieceTypes_TransportModuleSerialNumber");

            migrationBuilder.AddColumn<string>(
                name: "StoreSerialNumber",
                table: "WorkpieceTypes",
                type: "text",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "WorkpieceTypeFixedModules",
                columns: table => new
                {
                    WorkpieceTypeId = table.Column<string>(type: "text", nullable: false),
                    FixedModuleId = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_WorkpieceTypeFixedModules", x => new { x.WorkpieceTypeId, x.FixedModuleId });
                    table.ForeignKey(
                        name: "FK_WorkpieceTypeFixedModules_FixedModules_FixedModuleId",
                        column: x => x.FixedModuleId,
                        principalTable: "FixedModules",
                        principalColumn: "SerialNumber",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_WorkpieceTypeFixedModules_WorkpieceTypes_WorkpieceTypeId",
                        column: x => x.WorkpieceTypeId,
                        principalTable: "WorkpieceTypes",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_WorkpieceTypes_StoreSerialNumber",
                table: "WorkpieceTypes",
                column: "StoreSerialNumber");

            migrationBuilder.CreateIndex(
                name: "IX_WorkpieceTypeFixedModules_FixedModuleId",
                table: "WorkpieceTypeFixedModules",
                column: "FixedModuleId");

            migrationBuilder.AddForeignKey(
                name: "FK_WorkpieceTypes_Stores_StoreSerialNumber",
                table: "WorkpieceTypes",
                column: "StoreSerialNumber",
                principalTable: "Stores",
                principalColumn: "SerialNumber");

            migrationBuilder.AddForeignKey(
                name: "FK_WorkpieceTypes_TransportModules_TransportModuleSerialNumber",
                table: "WorkpieceTypes",
                column: "TransportModuleSerialNumber",
                principalTable: "TransportModules",
                principalColumn: "SerialNumber");
        }
    }
}
