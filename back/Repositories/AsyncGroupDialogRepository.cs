using Microsoft.EntityFrameworkCore;
using back.Contexts;
using back.Models;
using back.Repositories.Interfaces;

namespace back.Repositories
{
	public class AsyncGroupDialogRepository : AsyncRepositoryBase<GroupDialogModel>, IAsyncGroupDialogRepository
	{
		public AsyncGroupDialogRepository(DataContext context) : base(context) { }

		public async Task<IEnumerable<GroupDialogModel?>> GetByNameAsync(string name)
		{
			return await this.Set.Where(x => x.Name == name).ToListAsync();
		}

		public async Task<IEnumerable<GroupDialogModel?>> GetByNameContainsAsync(string name)
		{
			return await this.Set.Where(x => x.Name.Contains(name)).ToListAsync();
		}
	}
}
