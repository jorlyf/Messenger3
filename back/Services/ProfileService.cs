using back.Models;
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


		public Task<UserModel?> LoadUserAsync(int id)
		{
			return this.UoW.UserRepository.GetByIdAsync(id);
		}
	}
}
