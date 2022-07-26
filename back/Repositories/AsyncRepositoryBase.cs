using back.Contexts;
using back.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;

namespace back.Repositories
{
	public class AsyncRepositoryBase<T> : IAsyncRepositoryBase<T> where T : class
	{
		public DataContext Context { get; }
		public DbSet<T> Set { get; }
		public AsyncRepositoryBase(DataContext context)
		{
			this.Context = context;
			this.Set = context.Set<T>();
		}


		public async Task<T?> GetByIdAsync(int id)
		{
			return await this.Set.FindAsync(id);
		}

		public Task<T?> GetAsync(Expression<Func<T, bool>> where)
		{
			return this.Set.Where(where).FirstOrDefaultAsync();
		}

		public async Task<IEnumerable<T?>> GetManyAsync(Expression<Func<T, bool>> where)
		{
			return await this.Set.Where(where).ToListAsync();
		}

		public async Task<IEnumerable<T?>> GetAllAsync()
		{
			return await this.Set.ToListAsync();
		}

		public async Task AddAsync(T item)

		{
			await this.Set.AddAsync(item);
		}

		public Task UpdateAsync(T item)
		{
			return Task.Run(() => this.Set.Update(item));
			//return Task.Run(() => this.Context.Entry(item).State = EntityState.Modified);
		}

		public Task DeleteAsync(T item)
		{
			return Task.Run(() => this.Set.Remove(item));
		}

		public Task AttachAsync(T item)
		{
			return Task.Run(() => this.Set.Attach(item));
		}

		public Task SaveAsync()
		{
			return this.Context.SaveChangesAsync();
		}
	}
}
