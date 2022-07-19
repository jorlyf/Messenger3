using back.Models;
using back.Repositories;

namespace back.Services
{
	public class ChatService
	{
		private AsyncUnitOfWork UoW { get; }
		
		public ChatService(AsyncUnitOfWork uow)
		{
			this.UoW = uow;
		}


		public Task<IEnumerable<UserModel?>> SearchUsersByLoginContainsAsync(string login)
		{
			return this.UoW.UserRepository.GetByLoginContainsAsync(login);
		}

		public Task<IEnumerable<UserModel?>> SearchUsersByUsernameContainsAsync(string username)
		{
			return this.UoW.UserRepository.GetByUsernameContainsAsync(username);
		}

		public Task<IEnumerable<DialogModel?>> SearchDialogsByNameContainsAsync(string name)
		{
			return this.UoW.DialogRepository.GetByNameContainsAsync(name);
		}
	}
}
