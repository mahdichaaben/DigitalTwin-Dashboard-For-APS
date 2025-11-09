using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace backend_dash.Migrations
{
    /// <inheritdoc />
    public partial class updatedSlotwithoutwp : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_StorageSlots_Workpieces_WorkpieceId",
                table: "StorageSlots");

            migrationBuilder.DropIndex(
                name: "IX_StorageSlots_WorkpieceId",
                table: "StorageSlots");

            migrationBuilder.DropColumn(
                name: "WorkpieceId",
                table: "StorageSlots");

            migrationBuilder.AlterColumn<string>(
                name: "wpId",
                table: "ModuleLogs",
                type: "character varying(100)",
                maxLength: 100,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "character varying(100)",
                oldMaxLength: 100);

            migrationBuilder.AlterColumn<string>(
                name: "Status",
                table: "ModuleLogs",
                type: "character varying(50)",
                maxLength: 50,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "character varying(50)",
                oldMaxLength: 50);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "WorkpieceId",
                table: "StorageSlots",
                type: "text",
                nullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "wpId",
                table: "ModuleLogs",
                type: "character varying(100)",
                maxLength: 100,
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "character varying(100)",
                oldMaxLength: 100,
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Status",
                table: "ModuleLogs",
                type: "character varying(50)",
                maxLength: 50,
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "character varying(50)",
                oldMaxLength: 50,
                oldNullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_StorageSlots_WorkpieceId",
                table: "StorageSlots",
                column: "WorkpieceId");

            migrationBuilder.AddForeignKey(
                name: "FK_StorageSlots_Workpieces_WorkpieceId",
                table: "StorageSlots",
                column: "WorkpieceId",
                principalTable: "Workpieces",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);
        }
    }
}
