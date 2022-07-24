using back.Infrastructure.Exceptions;
using back.Models;
using back.Models.DTOs;
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


		public async Task<MessageModel> SendMessageToUserAsync(int senderId, MessageContainerDTO messageContainerDTO)
		{
			if (senderId == messageContainerDTO.ToId)
			{ throw new SendMessageException(SendMessageExceptionReasons.SenderUserIsReceiver); }

			if ((await this.UoW.UserRepository.GetByIdAsync(messageContainerDTO.ToId)) == null)
			{ throw new SendMessageException(SendMessageExceptionReasons.UserIsNotFound); }

			PrivateDialogModel? dialog = await GetPrivateDialogAsync(senderId, messageContainerDTO.ToId);
			if (dialog == null)
			{
				dialog = await CreatePrivateDialogAsync(senderId, messageContainerDTO.ToId);
			}

			string? messageText = messageContainerDTO.Message.Text;
			IEnumerable<AttachmentModel>? attachments = null;
			if (messageContainerDTO.Message.Attachments != null)
			{
				attachments = await this.FileService.SaveMessageAttachmentsAsync(messageContainerDTO.Message.Attachments);
			}

			MessageModel messageModel = new()
			{
				SenderUserId = senderId,
				Text = messageText,
				Attachments = attachments,
				SentAt = DateTime.Now
			};

			dialog.Messages.Add(messageModel);
			await this.UoW.PrivateDialogRepository.UpdateAsync(dialog);
			await this.UoW.PrivateDialogRepository.SaveAsync();

			return messageModel;
		}

		public async Task<DialogsDTO> GetDialogsDTOAsync(int userId)
		{
			Task<IEnumerable<PrivateDialogModel>> privateDialogs = this.UoW.PrivateDialogRepository.GetByUserId(userId);
			Task<IEnumerable<GroupDialogModel>> groupDialogs = this.UoW.GroupDialogRepository.GetByUserId(userId);

			await Task.WhenAll(privateDialogs, groupDialogs);

			IList<PrivateDialogDTO> privateDialogDTOs = new List<PrivateDialogDTO>();
			foreach (PrivateDialogModel dialog in privateDialogs.Result)
			{
				int id;
				if (dialog.FirstUserId != userId) { id = dialog.FirstUserId; }
				else { id = dialog.SecondUserId; }

				privateDialogDTOs.Add(new PrivateDialogDTO
				{
					UserId = id,
					Messages = dialog.Messages,
					LastUpdateTotalMilliseconds = new DateTimeOffset(dialog.LastUpdate).ToUnixTimeMilliseconds()
				});
			}

			IList<GroupDialogDTO> groupDialogDTOs = new List<GroupDialogDTO>();
			foreach (GroupDialogModel dialog in groupDialogs.Result)
			{
				groupDialogDTOs.Add(new GroupDialogDTO
				{
					GroupId = dialog.Id,
					UserIds = dialog.Users.Select(x => x.Id).ToList(),
					Name = dialog.Name,
					Messages = dialog.Messages,
					GroupAvatarUrl = dialog.AvatarUrl,
					LastUpdateTotalMilliseconds = new DateTimeOffset(dialog.LastUpdate).ToUnixTimeMilliseconds()
				});
			}

			return new DialogsDTO
			{
				PrivateDialogDTOs = privateDialogDTOs,
				GroupDialogDTOs = groupDialogDTOs
			};
		}

		public async Task<IEnumerable<UserModel>> GetUsersByLoginContains(int senderUserId, string login)
		{
			Task<UserModel?> senderUserTask = this.UoW.UserRepository.GetByIdAsync(senderUserId);
			Task<IEnumerable<UserModel>> usersTask = this.UoW.UserRepository.GetByLoginContainsAsync(login);

			await Task.WhenAll(senderUserTask, usersTask);
			UserModel? senderUser = senderUserTask.Result;
			IEnumerable<UserModel> users = usersTask.Result;

			if (senderUser == null) { throw new Exception(); }

			return users.Where(x => x.Login != senderUser.Login);
		}

		private Task<PrivateDialogModel?> GetPrivateDialogAsync(int firstId, int secondId)
		{
			return this.UoW.PrivateDialogRepository.GetByUserIdsAsync(firstId, secondId);
		}

		private async Task<PrivateDialogModel> CreatePrivateDialogAsync(int firstId, int secondId)
		{
			PrivateDialogModel dialog = new()
			{
				FirstUserId = firstId,
				SecondUserId = secondId,
				Messages = new List<MessageModel>(),
				LastUpdate = DateTime.Now,
			};
			await this.UoW.PrivateDialogRepository.AddAsync(dialog);
			await this.UoW.PrivateDialogRepository.SaveAsync();

			return dialog;
		}
	}
}
