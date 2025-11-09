using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace backend_dash.Migrations
{
    /// <inheritdoc />
    public partial class updatedWorkpieceLog : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateIndex(
                name: "IX_WorkpieceLogs_OrderId",
                table: "WorkpieceLogs",
                column: "OrderId");

            migrationBuilder.CreateIndex(
                name: "IX_WorkpieceLogs_WorkpieceId",
                table: "WorkpieceLogs",
                column: "WorkpieceId");

            migrationBuilder.AddForeignKey(
                name: "FK_WorkpieceLogs_Order",
                table: "WorkpieceLogs",
                column: "OrderId",
                principalTable: "Orders",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);

            migrationBuilder.AddForeignKey(
                name: "FK_WorkpieceLogs_Workpiece",
                table: "WorkpieceLogs",
                column: "WorkpieceId",
                principalTable: "Workpieces",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_WorkpieceLogs_Order",
                table: "WorkpieceLogs");

            migrationBuilder.DropForeignKey(
                name: "FK_WorkpieceLogs_Workpiece",
                table: "WorkpieceLogs");

            migrationBuilder.DropIndex(
                name: "IX_WorkpieceLogs_OrderId",
                table: "WorkpieceLogs");

            migrationBuilder.DropIndex(
                name: "IX_WorkpieceLogs_WorkpieceId",
                table: "WorkpieceLogs");
        }
    }
}
