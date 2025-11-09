using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace backend_dash.Migrations
{
    /// <inheritdoc />
    public partial class Orderupdate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Orders",
                columns: table => new
                {
                    Id = table.Column<string>(type: "text", nullable: false),
                    Status = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    RequestedBy = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: true),
                    FactoryRef = table.Column<string>(type: "text", nullable: false),
                    OrderType = table.Column<string>(type: "character varying(13)", maxLength: 13, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Orders", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Orders_DigitalFactories_FactoryRef",
                        column: x => x.FactoryRef,
                        principalTable: "DigitalFactories",
                        principalColumn: "Ref",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "WorkpieceTypes",
                columns: table => new
                {
                    Id = table.Column<string>(type: "text", nullable: false),
                    Name = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: false),
                    Color = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    StoreSerialNumber = table.Column<string>(type: "text", nullable: true),
                    TransportModuleSerialNumber = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_WorkpieceTypes", x => x.Id);
                    table.ForeignKey(
                        name: "FK_WorkpieceTypes_Stores_StoreSerialNumber",
                        column: x => x.StoreSerialNumber,
                        principalTable: "Stores",
                        principalColumn: "SerialNumber");
                    table.ForeignKey(
                        name: "FK_WorkpieceTypes_TransportModules_TransportModuleSerialNumber",
                        column: x => x.TransportModuleSerialNumber,
                        principalTable: "TransportModules",
                        principalColumn: "SerialNumber");
                });

            migrationBuilder.CreateTable(
                name: "Commands",
                columns: table => new
                {
                    Id = table.Column<string>(type: "text", nullable: false),
                    CommandName = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: false),
                    Status = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    OrderId = table.Column<string>(type: "text", nullable: true),
                    Timestamp = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    OrderUpdateId = table.Column<int>(type: "integer", nullable: false),
                    CommandType = table.Column<string>(type: "character varying(13)", maxLength: 13, nullable: false),
                    WorkpieceId = table.Column<string>(type: "text", nullable: true),
                    Location = table.Column<string>(type: "text", nullable: true),
                    Type = table.Column<string>(type: "text", nullable: true),
                    State = table.Column<string>(type: "text", nullable: true),
                    FromNodeRef = table.Column<string>(type: "text", nullable: true),
                    ToNodeRef = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Commands", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Commands_Orders_OrderId",
                        column: x => x.OrderId,
                        principalTable: "Orders",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Workpieces",
                columns: table => new
                {
                    Id = table.Column<string>(type: "text", nullable: false),
                    TypeId = table.Column<string>(type: "text", nullable: false),
                    OrderId = table.Column<string>(type: "text", nullable: false),
                    State = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false, defaultValue: "RAW"),
                    AddedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Workpieces", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Workpieces_Orders_OrderId",
                        column: x => x.OrderId,
                        principalTable: "Orders",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Workpieces_WorkpieceTypes_TypeId",
                        column: x => x.TypeId,
                        principalTable: "WorkpieceTypes",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

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
                name: "IX_Commands_OrderId",
                table: "Commands",
                column: "OrderId");

            migrationBuilder.CreateIndex(
                name: "IX_Orders_FactoryRef",
                table: "Orders",
                column: "FactoryRef");

            migrationBuilder.CreateIndex(
                name: "IX_Workpieces_OrderId",
                table: "Workpieces",
                column: "OrderId");

            migrationBuilder.CreateIndex(
                name: "IX_Workpieces_TypeId",
                table: "Workpieces",
                column: "TypeId");

            migrationBuilder.CreateIndex(
                name: "IX_WorkpieceTypeFixedModules_FixedModuleId",
                table: "WorkpieceTypeFixedModules",
                column: "FixedModuleId");

            migrationBuilder.CreateIndex(
                name: "IX_WorkpieceTypes_StoreSerialNumber",
                table: "WorkpieceTypes",
                column: "StoreSerialNumber");

            migrationBuilder.CreateIndex(
                name: "IX_WorkpieceTypes_TransportModuleSerialNumber",
                table: "WorkpieceTypes",
                column: "TransportModuleSerialNumber");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Commands");

            migrationBuilder.DropTable(
                name: "Workpieces");

            migrationBuilder.DropTable(
                name: "WorkpieceTypeFixedModules");

            migrationBuilder.DropTable(
                name: "Orders");

            migrationBuilder.DropTable(
                name: "WorkpieceTypes");
        }
    }
}
