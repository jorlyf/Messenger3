using back.Models;
using Microsoft.EntityFrameworkCore;

namespace back.Contexts
{
	public class DataContext : DbContext
	{
		public DbSet<UserModel> Users { get; set; }
		public DbSet<AttachmentModel> Attachments { get; set; }
		public DbSet<MessageModel> Messages { get; set; }
		public DbSet<PrivateDialogModel> PrivateDialogs { get; set; }
		public DbSet<GroupDialogModel> GroupDialogs { get; set; }

		public DataContext(DbContextOptions<DataContext> options) : base(options) { }
	}
}
