using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace backend_dash.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "DigitalFactories",
                columns: table => new
                {
                    Ref = table.Column<string>(type: "text", nullable: false),
                    Name = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DigitalFactories", x => x.Ref);
                });

            migrationBuilder.CreateTable(
                name: "DigitalModules",
                columns: table => new
                {
                    SerialNumber = table.Column<string>(type: "text", nullable: false),
                    Name = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: false),
                    TopicState = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: false),
                    TopicCommand = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: false),
                    Status = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false, defaultValue: "FINISHED"),
                    ComponentState = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: false),
                    FactoryId = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DigitalModules", x => x.SerialNumber);
                    table.ForeignKey(
                        name: "FK_DigitalModules_DigitalFactories_FactoryId",
                        column: x => x.FactoryId,
                        principalTable: "DigitalFactories",
                        principalColumn: "Ref",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "FixedModules",
                columns: table => new
                {
                    SerialNumber = table.Column<string>(type: "text", nullable: false),
                    Position = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_FixedModules", x => x.SerialNumber);
                    table.ForeignKey(
                        name: "FK_FixedModules_DigitalModules_SerialNumber",
                        column: x => x.SerialNumber,
                        principalTable: "DigitalModules",
                        principalColumn: "SerialNumber",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Stores",
                columns: table => new
                {
                    SerialNumber = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Stores", x => x.SerialNumber);
                    table.ForeignKey(
                        name: "FK_Stores_DigitalModules_SerialNumber",
                        column: x => x.SerialNumber,
                        principalTable: "DigitalModules",
                        principalColumn: "SerialNumber",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "TransportModules",
                columns: table => new
                {
                    SerialNumber = table.Column<string>(type: "text", nullable: false),
                    CurrentPosition = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: false, defaultValue: "")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TransportModules", x => x.SerialNumber);
                    table.ForeignKey(
                        name: "FK_TransportModules_DigitalModules_SerialNumber",
                        column: x => x.SerialNumber,
                        principalTable: "DigitalModules",
                        principalColumn: "SerialNumber",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "TaskFixedModules",
                columns: table => new
                {
                    Id = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    Name = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: false),
                    Order = table.Column<int>(type: "integer", nullable: false),
                    FixedModuleId = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TaskFixedModules", x => x.Id);
                    table.ForeignKey(
                        name: "FK_TaskFixedModules_FixedModules_FixedModuleId",
                        column: x => x.FixedModuleId,
                        principalTable: "FixedModules",
                        principalColumn: "SerialNumber",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "StorageModules",
                columns: table => new
                {
                    SerialNumber = table.Column<string>(type: "text", nullable: false),
                    Capacity = table.Column<int>(type: "integer", nullable: false, defaultValue: 0),
                    StoreId = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_StorageModules", x => x.SerialNumber);
                    table.ForeignKey(
                        name: "FK_StorageModules_FixedModules_SerialNumber",
                        column: x => x.SerialNumber,
                        principalTable: "FixedModules",
                        principalColumn: "SerialNumber",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_StorageModules_Stores_StoreId",
                        column: x => x.StoreId,
                        principalTable: "Stores",
                        principalColumn: "SerialNumber",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_DigitalModules_FactoryId",
                table: "DigitalModules",
                column: "FactoryId");

            migrationBuilder.CreateIndex(
                name: "IX_StorageModules_StoreId",
                table: "StorageModules",
                column: "StoreId");

            migrationBuilder.CreateIndex(
                name: "IX_TaskFixedModules_FixedModuleId",
                table: "TaskFixedModules",
                column: "FixedModuleId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "StorageModules");

            migrationBuilder.DropTable(
                name: "TaskFixedModules");

            migrationBuilder.DropTable(
                name: "TransportModules");

            migrationBuilder.DropTable(
                name: "Stores");

            migrationBuilder.DropTable(
                name: "FixedModules");

            migrationBuilder.DropTable(
                name: "DigitalModules");

            migrationBuilder.DropTable(
                name: "DigitalFactories");
        }
    }
}
