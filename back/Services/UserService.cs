using Microsoft.EntityFrameworkCore;
using back.Repositories;
using back.Entities.Db.User;
using back.Infrastructure.Exceptions;

namespace back.Services
{
	public class UserService
	{
		private UnitOfWork UoW { get; }

		public UserService(UnitOfWork uow)
		{
			this.UoW = uow;
		}

		public Task<UserModel?> GetUserByIdAsync(int id)
		{
			return this.UoW.UserRepository.GetById(id).FirstOrDefaultAsync();
		}

		public async Task<IEnumerable<UserModel>> GetUsersByLoginContainsAsync(int senderUserId, string login)
		{
			Task<UserModel?> senderUserTask = this.UoW.UserRepository.GetById(senderUserId).FirstOrDefaultAsync();
			Task<List<UserModel>> usersTask = this.UoW.UserRepository.GetByLoginContains(login).ToListAsync();

			await Task.WhenAll(senderUserTask, usersTask);
			UserModel? senderUser = senderUserTask.Result;
			IEnumerable<UserModel> users = usersTask.Result;

			if (senderUser == null) { throw new ApiException(ApiExceptionReason.UserIsNotFound); }

			return users.Where(x => x.Login != senderUser.Login);
		}
	}
}
