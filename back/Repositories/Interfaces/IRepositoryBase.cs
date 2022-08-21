using System.Linq.Expressions;
using back.Entities.Db;

namespace back.Repositories.Interfaces
{
	public interface IRepositoryBase<T> where T : class, IEntity
	{
		IQueryable<T> GetById(int id);
		IQueryable<T> GetWhere(Expression<Func<T, bool>> where);
		IQueryable<T> GetAll();
		Task AddAsync(T item);
		void Update(T item);
		void Delete(T item);
		void Attach(T item);
		Task SaveAsync();
	}
}
