using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace backend_dash.Migrations
{
    /// <inheritdoc />
    public partial class updatedWStateInDb : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_FixedModules_WorkpieceTypes_WorkpieceTypeId",
                table: "FixedModules");

            migrationBuilder.DropForeignKey(
                name: "FK_WorkpieceTypes_DigitalModules_DigitalModuleSerialNumber",
                table: "WorkpieceTypes");

            migrationBuilder.DropIndex(
                name: "IX_WorkpieceTypes_DigitalModuleSerialNumber",
                table: "WorkpieceTypes");

            migrationBuilder.DropIndex(
                name: "IX_FixedModules_WorkpieceTypeId",
                table: "FixedModules");

            migrationBuilder.DropColumn(
                name: "DigitalModuleSerialNumber",
                table: "WorkpieceTypes");

            migrationBuilder.DropColumn(
                name: "WorkpieceTypeId",
                table: "FixedModules");

            migrationBuilder.AddColumn<string>(
                name: "State",
                table: "Workpieces",
                type: "character varying(100)",
                maxLength: 100,
                nullable: false,
                defaultValue: "FREE");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "State",
                table: "Workpieces");

            migrationBuilder.AddColumn<string>(
                name: "DigitalModuleSerialNumber",
                table: "WorkpieceTypes",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "WorkpieceTypeId",
                table: "FixedModules",
                type: "text",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_WorkpieceTypes_DigitalModuleSerialNumber",
                table: "WorkpieceTypes",
                column: "DigitalModuleSerialNumber");

            migrationBuilder.CreateIndex(
                name: "IX_FixedModules_WorkpieceTypeId",
                table: "FixedModules",
                column: "WorkpieceTypeId");

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
    }
}
