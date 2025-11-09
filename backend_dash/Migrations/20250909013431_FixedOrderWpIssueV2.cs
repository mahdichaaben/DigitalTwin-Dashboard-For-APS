using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace backend_dash.Migrations
{
    /// <inheritdoc />
    public partial class FixedOrderWpIssueV2 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Workpieces_Orders_OrderId",
                table: "Workpieces");

            migrationBuilder.DropIndex(
                name: "IX_Workpieces_OrderId",
                table: "Workpieces");

            migrationBuilder.DropColumn(
                name: "OrderId",
                table: "Workpieces");

            migrationBuilder.AddColumn<string>(
                name: "ModuleState",
                table: "ModuleLogs",
                type: "character varying(255)",
                maxLength: 255,
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ModuleState",
                table: "ModuleLogs");

            migrationBuilder.AddColumn<string>(
                name: "OrderId",
                table: "Workpieces",
                type: "text",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Workpieces_OrderId",
                table: "Workpieces",
                column: "OrderId");

            migrationBuilder.AddForeignKey(
                name: "FK_Workpieces_Orders_OrderId",
                table: "Workpieces",
                column: "OrderId",
                principalTable: "Orders",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);
        }
    }
}
