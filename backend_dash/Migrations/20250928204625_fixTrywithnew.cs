using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace backend_dash.Migrations
{
    /// <inheritdoc />
    public partial class fixTrywithnew : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey(
                name: "PK_Alerts",
                table: "Alerts");

            migrationBuilder.RenameTable(
                name: "Alerts",
                newName: "AlertsLog");

            migrationBuilder.AddPrimaryKey(
                name: "PK_AlertsLog",
                table: "AlertsLog",
                column: "AlertId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey(
                name: "PK_AlertsLog",
                table: "AlertsLog");

            migrationBuilder.RenameTable(
                name: "AlertsLog",
                newName: "Alerts");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Alerts",
                table: "Alerts",
                column: "AlertId");
        }
    }
}
