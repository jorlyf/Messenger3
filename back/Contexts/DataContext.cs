using back.Models;
using Microsoft.EntityFrameworkCore;

namespace back.Contexts
{
	public class DataContext : DbContext
	{
		public DbSet<UserModel> Users { get; set; }
		public DbSet<AttachmentModel> Attachments { get; set; }
		public DbSet<MessageModel> Messages { get; set; }
		public DbSet<DialogModel> Dialogs { get; set; }

		public DataContext(DbContextOptions<DataContext> options) : base(options) { }
	}
}
