using Microsoft.EntityFrameworkCore;
using back.Contexts;
using back.Models;
using back.Repositories.Interfaces;

namespace back.Repositories
{
	public class AsyncDialogRepository : AsyncRepositoryBase<DialogModel>, IAsyncDialogRepository
	{
		public AsyncDialogRepository(DataContext context) : base(context) { }

		public async Task<IEnumerable<DialogModel?>> GetByNameAsync(string name)
		{
			return await this.Set.Where(x => x.Name == name).ToListAsync();
		}

		public async Task<IEnumerable<DialogModel?>> GetByNameContainsAsync(string name)
		{
			return await this.Set.Where(x => x.Name.Contains(name)).ToListAsync();
		}

		public Task<DialogModel?> GetPrivateAsync(UserModel firstUser, UserModel secondUser)
		{
			return this.Set
				.Where(x => x.IsPrivate == true)
				.Where(x => x.Users.Contains(firstUser))
				.Where(x => x.Users.Contains(secondUser))
				.FirstOrDefaultAsync();
		}
	}
}
