using back.Entities.Db.User;
using back.Repositories;

namespace back.Services
{
	public class ProfileService
	{
		private AsyncUnitOfWork UoW { get; }

		public ProfileService(AsyncUnitOfWork uow)
		{
			this.UoW = uow;
		}


		public Task<UserModel?> GetUserAsync(int id)
		{
			return this.UoW.UserRepository.GetByIdAsync(id);
		}
	}
}
