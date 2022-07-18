using Microsoft.EntityFrameworkCore;
using back.Contexts;
using back.Models;
using back.Repositories.Interfaces;

namespace back.Repositories
{
	public class AsyncUserRepository : AsyncRepositoryBase<UserModel>, IAsyncUserRepository
	{
		public AsyncUserRepository(DataContext context) : base(context) { }

		public Task<UserModel?> GetByLoginAsync(string login)
		{
			return this.Set.Where(x => x.Login == login).FirstOrDefaultAsync();
		}
		public Task<UserModel?> GetByUsernameAsync(string username)
		{
			return this.Set.Where(x => x.Username == username).FirstOrDefaultAsync();
		}
	}
}
