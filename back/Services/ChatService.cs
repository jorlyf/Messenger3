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


		public async Task SendMessageToGroupAsync(int groupId, MessageDTO messageUserModel, UserModel senderUser)
		{
			throw new NotImplementedException();
		}

		public async Task SendMessageToUserAsync(int userId, MessageDTO messageDTO, int senderUserId)
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

			DialogModel? dialog = await this.UoW.DialogRepository.GetPrivateAsync(user, senderUser);
			if (dialog == null) { dialog = await CreatePrivateDialogAsync(user, senderUser); }


			await SendMessage(dialog, messageDTO, senderUser);
		}

		private async Task SendMessage(DialogModel dialog, MessageDTO messageDTO, UserModel senderUser)
		{
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
				Text = messageDTO.Text,
				Attachments = attachments
			};
			messages.Add(newMessage);
			dialog.Messages = messages;

			await this.UoW.DialogRepository.UpdateAsync(dialog);
			await this.UoW.DialogRepository.SaveAsync();
		}

		public async Task<DialogModel> CreateGroupDialogAsync(IEnumerable<UserModel> users)
		{
			DialogModel dialog = new()
			{
				IsPrivate = false,
				Name = string.Join(" ", users.Select(x => x.Login)),
				Users = users
			};
			await this.UoW.DialogRepository.AddAsync(dialog);
			await this.UoW.DialogRepository.SaveAsync();

			return dialog;
		}

		public async Task<DialogModel> CreatePrivateDialogAsync(UserModel firstUser, UserModel secondUser)
		{
			UserModel[] users = new UserModel[2];
			users[0] = firstUser;
			users[1] = secondUser;

			DialogModel dialog = new()
			{
				IsPrivate = true,
				Users = users
			};
			await this.UoW.DialogRepository.AddAsync(dialog);
			await this.UoW.DialogRepository.SaveAsync();

			return dialog;
		}


		public Task<IEnumerable<UserModel?>> SearchUsersByLoginContainsAsync(string login)
		{
			return this.UoW.UserRepository.GetByLoginContainsAsync(login);
		}

		public Task<IEnumerable<DialogModel?>> SearchDialogsByNameContainsAsync(string name)
		{
			return this.UoW.DialogRepository.GetByNameContainsAsync(name);
		}
	}
}
