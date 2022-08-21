using back.Contexts;
using back.Repositories.Interfaces;
using back.Entities.Db.User;

namespace back.Repositories
{
	public class UserRepository : RepositoryBase<UserModel>, IUserRepository
	{
		public UserRepository(DataContext context) : base(context) { }


		public IQueryable<UserModel> GetByLogin(string login)
		{
			return this.Set.Where(x => x.Login == login);
		}

		public IQueryable<UserModel> GetByLoginContains(string login)
		{
			return this.Set.Where(x => x.Login.Contains(login));
		}
	}
}
