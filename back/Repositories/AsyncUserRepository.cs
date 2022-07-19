﻿using Microsoft.EntityFrameworkCore;
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

		public async Task<IEnumerable<UserModel?>> GetByLoginContainsAsync(string login)
		{
			return await this.Set.Where(x => x.Login.Contains(login)).ToListAsync();
		}

		public async Task<IEnumerable<UserModel?>> GetByUsernameAsync(string username)
		{
			return await this.Set.Where(x => x.Username == username).ToListAsync();
		}

		public async Task<IEnumerable<UserModel?>> GetByUsernameContainsAsync(string username)
		{
			return await this.Set.Where(x => x.Username.Contains(username)).ToListAsync();
		}
	}
}
