using back.Models;

namespace back.Repositories.Interfaces
{
	public interface IAsyncUserRepository : IAsyncRepositoryBase<UserModel>
	{
		Task<UserModel?> GetByLoginAsync(string login);
		Task<IEnumerable<UserModel>> GetByLoginContainsAsync(string login);
	}
}
