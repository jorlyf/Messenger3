using back.Infrastructure.Exceptions;
using back.Models;
using back.Models.DTOs.Chat;
using back.Repositories;

namespace back.Services
{
	public class ChatService
	{
		private AsyncUnitOfWork UoW { get; }
		private FileService FileService { get; }

		public ChatService(AsyncUnitOfWork uow, FileService fileService)
		{
			this.UoW = uow;
			this.FileService = fileService;
		}


		public async Task<MessageModel> SendMessageToGroupAsync(int groupId, MessageDTO messageUserModel, UserModel senderUser)
		{
			throw new NotImplementedException();
		}

		public async Task<MessageModel> SendMessageToUserAsync(int userId, MessageDTO messageDTO, int senderUserId)
		{
			Task<UserModel?> userTask = this.UoW.UserRepository.GetByIdAsync(userId);
			Task<UserModel?> senderUserTask = this.UoW.UserRepository.GetByIdAsync(senderUserId);

			Task.WaitAll(userTask, senderUserTask);
			UserModel? user = userTask.Result;
			UserModel? senderUser = senderUserTask.Result;

			if (user == null || senderUser == null)
			{
				throw new SendMessageException(SendMessageExceptionReasons.UserIsNotFound);
			}

			PrivateDialogModel? dialog = await this.UoW.PrivateDialogRepository.GetByUsersAsync(user, senderUser);
			if (dialog == null) { dialog = await CreatePrivateDialogAsync(user, senderUser); }


			List<MessageModel> messages;
			if (dialog.Messages != null) { messages = dialog.Messages.ToList(); }
			else { messages = new(); }

			IEnumerable<AttachmentModel> attachments;
			if (messageDTO.Attachments != null)
			{
				attachments = await this.FileService.SaveMessageAttachmentsAsync(messageDTO.Attachments);
			}
			else { attachments = Enumerable.Empty<AttachmentModel>(); }

			MessageModel newMessage = new()
			{
				SenderUser = senderUser,
				Text = messageDTO.Text,
				Attachments = attachments,
				SentAt = DateTime.Now
			};
			messages.Add(newMessage);
			dialog.Messages = messages;
			dialog.LastUpdate = DateTime.Now;

			await this.UoW.PrivateDialogRepository.UpdateAsync(dialog);
			await this.UoW.PrivateDialogRepository.SaveAsync();

			return newMessage;
		}

		public async Task<GroupDialogModel> CreateGroupDialogAsync(IEnumerable<UserModel> users)
		{
			GroupDialogModel dialog = new()
			{
				Name = string.Join(" ", users.Select(x => x.Login)),
				Users = users,
				LastUpdate = DateTime.Now,
			};
			await this.UoW.GroupDialogRepository.AddAsync(dialog);
			await this.UoW.GroupDialogRepository.SaveAsync();

			return dialog;
		}

		public async Task<PrivateDialogModel> CreatePrivateDialogAsync(UserModel firstUser, UserModel secondUser)
		{
			PrivateDialogModel dialog = new()
			{
				FirstUserId = firstUser.Id,
				SecondUserId = secondUser.Id,
				LastUpdate = DateTime.Now,
			};
			await this.UoW.PrivateDialogRepository.AddAsync(dialog);
			await this.UoW.PrivateDialogRepository.SaveAsync();

			return dialog;
		}

		public Task<PrivateDialogModel?> SearchPrivateDialogByUserIds(int firstUserId, int secondUserId)
		{
			return this.UoW.PrivateDialogRepository.GetByUserIdsAsync(firstUserId, secondUserId);
		}


		public Task<IEnumerable<UserModel>> SearchUsersByLoginContainsAsync(string login)
		{
			return this.UoW.UserRepository.GetByLoginContainsAsync(login);
		}

		public Task<IEnumerable<GroupDialogModel>> SearchGroupDialogsByNameContainsAsync(string name)
		{
			return this.UoW.GroupDialogRepository.GetByNameContainsAsync(name);
		}
	}
}
