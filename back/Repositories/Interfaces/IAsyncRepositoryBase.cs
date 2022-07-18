using System.Linq.Expressions;

namespace back.Repositories.Interfaces
{
	public interface IAsyncRepositoryBase<T> where T : class
	{
		Task<T?> GetByIdAsync(int id);
		Task<T?> GetAsync(Expression<Func<T, bool>> where);
		Task<IEnumerable<T?>> GetManyAsync(Expression<Func<T, bool>> where);
		Task<IEnumerable<T?>> GetAllAsync();
		Task AddAsync(T item);
		Task UpdateAsync(T item);
		Task DeleteAsync(T item);
		Task SaveAsync();
	}
}
