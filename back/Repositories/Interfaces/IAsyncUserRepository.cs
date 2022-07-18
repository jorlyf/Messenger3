using back.Models;

namespace back.Repositories.Interfaces
{
	public interface IAsyncUserRepository : IAsyncRepositoryBase<UserModel>
	{
		Task<UserModel?> GetByLoginAsync(string login);
		Task<UserModel?> GetByUsernameAsync(string username);
	}
}
