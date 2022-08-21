using back.Entities.Db.User;

namespace back.Repositories.Interfaces
{
	public interface IUserRepository : IRepositoryBase<UserModel>
	{
		IQueryable<UserModel> GetByLogin(string login);
		IQueryable<UserModel> GetByLoginContains(string login);
	}
}
