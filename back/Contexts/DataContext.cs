using back.Models;
using Microsoft.EntityFrameworkCore;

namespace back.Contexts
{
	public class DataContext : DbContext
	{
		public DbSet<UserModel> Users { get; set; }

		public DataContext(DbContextOptions<DataContext> options) : base(options) { }
	}
}
