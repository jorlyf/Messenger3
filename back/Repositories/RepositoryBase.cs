using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;
using back.Contexts;
using back.Entities.Db;
using back.Repositories.Interfaces;

namespace back.Repositories
{
	public class RepositoryBase<T> : IRepositoryBase<T> where T : class, IEntity
	{
		public DataContext Context { get; }
		public DbSet<T> Set { get; }
		public RepositoryBase(DataContext context)
		{
			this.Context = context;
			this.Set = context.Set<T>();
		}


		public IQueryable<T> GetById(int id)
		{
			return this.Set.Where(x => x.Id == id);
		}

		public IQueryable<T> GetWhere(Expression<Func<T, bool>> where)
		{
			return this.Set.Where(where);
		}

		public IQueryable<T> GetAll()
		{
			return this.Set;
		}

		public async Task AddAsync(T item)
		{
			await this.Set.AddAsync(item);
		}

		public void Update(T item)
		{
			this.Set.Update(item);
		}

		public void Delete(T item)
		{
			this.Set.Remove(item);
		}

		public void Attach(T item)
		{
			this.Set.Attach(item);
		}

		public Task SaveAsync()
		{
			return this.Context.SaveChangesAsync();
		}
	}
}
