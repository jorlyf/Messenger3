using Microsoft.EntityFrameworkCore;
using back.Contexts;
using back.Repositories.Interfaces;
using back.Entities.Db.Dialog;

namespace back.Repositories
{
	public class AsyncGroupDialogRepository : AsyncRepositoryBase<GroupDialogModel>, IAsyncGroupDialogRepository
	{
		public AsyncGroupDialogRepository(DataContext context) : base(context) { }

		public override async Task<GroupDialogModel?> GetByIdAsync(int id)
		{
			return await this.Set
				.Where(x => x.Id == id)
				.Include(x => x.Users)
				.Include(x => x.Messages)
					.ThenInclude(x => x.SenderUser)
				.Include(x => x.Messages)
					.ThenInclude(x => x.Attachments)
				.FirstOrDefaultAsync();
		}

		public async Task<IEnumerable<GroupDialogModel>> GetByNameAsync(string name)
		{
			return await this.Set.Where(x => x.Name == name).ToListAsync();
		}

		public async Task<IEnumerable<GroupDialogModel>> GetByNameContainsAsync(string name)
		{
			return await this.Set.Where(x => x.Name.Contains(name)).ToListAsync();
		}

		public async Task<IEnumerable<GroupDialogModel>> GetByUserId(int userId)
		{
			return await this.Set
				.Where(x => x.Users.Any(u => u.Id == userId))
				.Include(x => x.Users)
				.Include(x => x.Messages)
					.ThenInclude(x => x.SenderUser)
				.Include(x => x.Messages)
					.ThenInclude(x => x.Attachments)
				.ToListAsync();
		}
	}
}
