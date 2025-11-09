using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace backend_dash.Migrations
{
    /// <inheritdoc />
    public partial class updatedLogDb : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Orders_DigitalFactories_FactoryRef",
                table: "Orders");

            migrationBuilder.DropForeignKey(
                name: "FK_Workpieces_Orders_OrderId",
                table: "Workpieces");

            migrationBuilder.DropIndex(
                name: "IX_Orders_FactoryRef",
                table: "Orders");

            migrationBuilder.DropColumn(
                name: "AddedAt",
                table: "Workpieces");

            migrationBuilder.DropColumn(
                name: "FactoryRef",
                table: "Orders");

            migrationBuilder.AlterColumn<string>(
                name: "OrderId",
                table: "Workpieces",
                type: "text",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "text");

            migrationBuilder.AlterColumn<string>(
                name: "FixedModuleId",
                table: "TaskFixedModules",
                type: "text",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "text",
                oldNullable: true);

            migrationBuilder.CreateTable(
                name: "ModuleLogs",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    ModuleSerialNumber = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    ModuleName = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: true),
                    CommandName = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: true),
                    wpId = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    Status = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    Timestamp = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ModuleLogs", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "WorkpieceLogs",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    WorkpieceId = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    WorkpieceType = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: true),
                    State = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    ModuleSerial = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true),
                    OrderId = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true),
                    Timestamp = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_WorkpieceLogs", x => x.Id);
                });

            migrationBuilder.AddForeignKey(
                name: "FK_Workpieces_Orders_OrderId",
                table: "Workpieces",
                column: "OrderId",
                principalTable: "Orders",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Workpieces_Orders_OrderId",
                table: "Workpieces");

            migrationBuilder.DropTable(
                name: "ModuleLogs");

            migrationBuilder.DropTable(
                name: "WorkpieceLogs");

            migrationBuilder.AlterColumn<string>(
                name: "OrderId",
                table: "Workpieces",
                type: "text",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "text",
                oldNullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "AddedAt",
                table: "Workpieces",
                type: "timestamp with time zone",
                nullable: false,
                defaultValueSql: "CURRENT_TIMESTAMP");

            migrationBuilder.AlterColumn<string>(
                name: "FixedModuleId",
                table: "TaskFixedModules",
                type: "text",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "text");

            migrationBuilder.AddColumn<string>(
                name: "FactoryRef",
                table: "Orders",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.CreateIndex(
                name: "IX_Orders_FactoryRef",
                table: "Orders",
                column: "FactoryRef");

            migrationBuilder.AddForeignKey(
                name: "FK_Orders_DigitalFactories_FactoryRef",
                table: "Orders",
                column: "FactoryRef",
                principalTable: "DigitalFactories",
                principalColumn: "Ref",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Workpieces_Orders_OrderId",
                table: "Workpieces",
                column: "OrderId",
                principalTable: "Orders",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
