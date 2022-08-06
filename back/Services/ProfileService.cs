using back.Entities.Db.User;
using back.Infrastructure.Exceptions;
using back.Repositories;

namespace back.Services
{
	public class ProfileService
	{
		private AsyncUnitOfWork UoW { get; }
		private FileService FileService { get; }

		public ProfileService(AsyncUnitOfWork uow, FileService fileService)
		{
			this.UoW = uow;
			this.FileService = fileService;
		}

		public Task<UserModel?> GetUserAsync(int id)
		{
			return this.UoW.UserRepository.GetByIdAsync(id);
		}

		public async Task<string> UploadAvatarAsync(int userId, IFormFile avatar)
		{
			Task<UserModel?> userTask = this.UoW.UserRepository.GetByIdAsync(userId);
			Task<string> avatarUrlTask = this.FileService.SaveAvatar(avatar);

			await Task.WhenAll(userTask, avatarUrlTask);
			UserModel? user = userTask.Result;
			string avatarUrl = avatarUrlTask.Result;

			if (user == null) throw new ApiException(ApiExceptionReason.UserIsNotFound);

			user.AvatarUrl = avatarUrl;
			await this.UoW.UserRepository.UpdateAsync(user);
			await this.UoW.UserRepository.SaveAsync();

			return avatarUrl;
		}
	}
}
