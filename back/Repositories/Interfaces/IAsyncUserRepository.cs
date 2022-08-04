using back.Entities.Db.User;

namespace back.Repositories.Interfaces
{
	public interface IAsyncUserRepository : IAsyncRepositoryBase<UserModel>
	{
		Task<UserModel?> GetByLoginAsync(string login);
		Task<IEnumerable<UserModel>> GetByLoginContainsAsync(string login);
	}
}
