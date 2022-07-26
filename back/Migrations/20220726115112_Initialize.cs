using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace back.Migrations
{
    public partial class Initialize : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "GroupDialogs",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Name = table.Column<string>(type: "TEXT", nullable: false),
                    AvatarUrl = table.Column<string>(type: "TEXT", nullable: true),
                    LastUpdate = table.Column<DateTime>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_GroupDialogs", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Users",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Login = table.Column<string>(type: "TEXT", maxLength: 20, nullable: false),
                    Password = table.Column<string>(type: "TEXT", maxLength: 20, nullable: false),
                    AvatarUrl = table.Column<string>(type: "TEXT", nullable: true),
                    GroupDialogModelId = table.Column<int>(type: "INTEGER", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Users", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Users_GroupDialogs_GroupDialogModelId",
                        column: x => x.GroupDialogModelId,
                        principalTable: "GroupDialogs",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "PrivateDialogs",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    FirstUserId = table.Column<int>(type: "INTEGER", nullable: false),
                    SecondUserId = table.Column<int>(type: "INTEGER", nullable: false),
                    LastUpdate = table.Column<DateTime>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PrivateDialogs", x => x.Id);
                    table.ForeignKey(
                        name: "FK_PrivateDialogs_Users_FirstUserId",
                        column: x => x.FirstUserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_PrivateDialogs_Users_SecondUserId",
                        column: x => x.SecondUserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Messages",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    SenderUserId = table.Column<int>(type: "INTEGER", nullable: false),
                    Text = table.Column<string>(type: "TEXT", maxLength: 1024, nullable: true),
                    SentAt = table.Column<DateTime>(type: "TEXT", nullable: false),
                    GroupDialogModelId = table.Column<int>(type: "INTEGER", nullable: true),
                    PrivateDialogModelId = table.Column<int>(type: "INTEGER", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Messages", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Messages_GroupDialogs_GroupDialogModelId",
                        column: x => x.GroupDialogModelId,
                        principalTable: "GroupDialogs",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_Messages_PrivateDialogs_PrivateDialogModelId",
                        column: x => x.PrivateDialogModelId,
                        principalTable: "PrivateDialogs",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_Messages_Users_SenderUserId",
                        column: x => x.SenderUserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Attachments",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Type = table.Column<byte>(type: "INTEGER", nullable: false),
                    Url = table.Column<string>(type: "TEXT", nullable: false),
                    MessageModelId = table.Column<int>(type: "INTEGER", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Attachments", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Attachments_Messages_MessageModelId",
                        column: x => x.MessageModelId,
                        principalTable: "Messages",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateIndex(
                name: "IX_Attachments_MessageModelId",
                table: "Attachments",
                column: "MessageModelId");

            migrationBuilder.CreateIndex(
                name: "IX_Messages_GroupDialogModelId",
                table: "Messages",
                column: "GroupDialogModelId");

            migrationBuilder.CreateIndex(
                name: "IX_Messages_PrivateDialogModelId",
                table: "Messages",
                column: "PrivateDialogModelId");

            migrationBuilder.CreateIndex(
                name: "IX_Messages_SenderUserId",
                table: "Messages",
                column: "SenderUserId");

            migrationBuilder.CreateIndex(
                name: "IX_PrivateDialogs_FirstUserId",
                table: "PrivateDialogs",
                column: "FirstUserId");

            migrationBuilder.CreateIndex(
                name: "IX_PrivateDialogs_SecondUserId",
                table: "PrivateDialogs",
                column: "SecondUserId");

            migrationBuilder.CreateIndex(
                name: "IX_Users_GroupDialogModelId",
                table: "Users",
                column: "GroupDialogModelId");

            migrationBuilder.CreateIndex(
                name: "IX_Users_Login",
                table: "Users",
                column: "Login",
                unique: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Attachments");

            migrationBuilder.DropTable(
                name: "Messages");

            migrationBuilder.DropTable(
                name: "PrivateDialogs");

            migrationBuilder.DropTable(
                name: "Users");

            migrationBuilder.DropTable(
                name: "GroupDialogs");
        }
    }
}
