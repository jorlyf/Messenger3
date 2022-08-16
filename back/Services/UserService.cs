using back.Repositories;
using back.Entities.Db.User;

namespace back.Services
{
	public class UserService
	{
		private AsyncUnitOfWork UoW { get; }

		public UserService(AsyncUnitOfWork uow)
		{
			this.UoW = uow;
		}

		public Task<UserModel?> GetUserByIdAsync(int id)
		{
			return this.UoW.UserRepository.GetByIdAsync(id);
		}

		public async Task<IEnumerable<UserModel>> GetUsersByLoginContainsAsync(int senderUserId, string login)
		{
			Task<UserModel?> senderUserTask = this.UoW.UserRepository.GetByIdAsync(senderUserId);
			Task<IEnumerable<UserModel>> usersTask = this.UoW.UserRepository.GetByLoginContainsAsync(login);

			await Task.WhenAll(senderUserTask, usersTask);
			UserModel? senderUser = senderUserTask.Result;
			IEnumerable<UserModel> users = usersTask.Result;

			if (senderUser == null) { throw new Exception(); }

			return users.Where(x => x.Login != senderUser.Login);
		}
	}
}
