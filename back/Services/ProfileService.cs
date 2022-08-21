using Microsoft.EntityFrameworkCore;
using back.Entities.Db.User;
using back.Infrastructure.Exceptions;
using back.Repositories;

namespace back.Services
{
	public class ProfileService
	{
		private UnitOfWork UoW { get; }
		private FileService FileService { get; }

		public ProfileService(UnitOfWork uow, FileService fileService)
		{
			this.UoW = uow;
			this.FileService = fileService;
		}

		public async Task<string> UploadAvatarAsync(int userId, IFormFile avatar)
		{
			Task<UserModel?> userTask = this.UoW.UserRepository.GetById(userId).FirstOrDefaultAsync();
			Task<string> avatarUrlTask = this.FileService.SaveAvatar(avatar);

			await Task.WhenAll(userTask, avatarUrlTask);
			UserModel? user = userTask.Result;
			string avatarUrl = avatarUrlTask.Result;

			if (user == null) throw new ApiException(ApiExceptionReason.UserIsNotFound);

			user.AvatarUrl = avatarUrl;
			this.UoW.UserRepository.Update(user);
			await this.UoW.UserRepository.SaveAsync();

			return avatarUrl;
		}
	}
}
