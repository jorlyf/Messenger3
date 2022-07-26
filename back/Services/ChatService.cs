using back.Infrastructure;
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


		public async Task<MessageModel> SendMessageToUserAsync(int senderId, SendMessageContainerDTO messageContainerDTO)
		{
			if (senderId == messageContainerDTO.ToId)
			{ throw new ApiException(ApiExceptionReason.SenderUserIsReceiver); }

			if ((await this.UoW.UserRepository.GetByIdAsync(messageContainerDTO.ToId)) == null)
			{ throw new ApiException(ApiExceptionReason.UserIsNotFound); }

			Task<UserModel?> senderUserTask = this.UoW.UserRepository.GetByIdAsync(senderId);
			Task<UserModel?> receiveUserTask = this.UoW.UserRepository.GetByIdAsync(messageContainerDTO.ToId);

			Task.WaitAll(senderUserTask, receiveUserTask);
			UserModel? senderUser = senderUserTask.Result;
			UserModel? receiveUser = receiveUserTask.Result;
			if (senderUser == null || receiveUser == null)
			{ throw new ApiException(ApiExceptionReason.UserIsNotFound); }

			await this.UoW.UserRepository.AttachAsync(senderUser);
			await this.UoW.UserRepository.AttachAsync(receiveUser);


			PrivateDialogModel? dialog = await GetPrivateDialogAsync(senderUser.Id, receiveUser.Id);
			if (dialog == null)
			{ dialog = await CreatePrivateDialogAsync(senderUser, receiveUser); }

			string? messageText = messageContainerDTO.Message.Text;
			IEnumerable<AttachmentModel>? attachments = null;
			if (messageContainerDTO.Message.Attachments != null)
			{ attachments = await this.FileService.SaveMessageAttachmentsAsync(messageContainerDTO.Message.Attachments); }

			MessageModel messageModel = new()
			{
				SenderUser = senderUser,
				Text = messageText,
				Attachments = attachments,
				SentAt = DateTime.Now
			};

			dialog.Messages.Add(messageModel);
			await this.UoW.PrivateDialogRepository.UpdateAsync(dialog);
			await this.UoW.PrivateDialogRepository.SaveAsync();

			return messageModel;
		}

		public async Task<DialogsDTO> GetDialogsDTOAsync(int responseSenderUserId)
		{
			Task<IEnumerable<PrivateDialogModel>> privateDialogs = this.UoW.PrivateDialogRepository.GetByUserId(responseSenderUserId);
			Task<IEnumerable<GroupDialogModel>> groupDialogs = this.UoW.GroupDialogRepository.GetByUserId(responseSenderUserId);

			await Task.WhenAll(privateDialogs, groupDialogs);

			IList<PrivateDialogDTO> privateDialogDTOs = new List<PrivateDialogDTO>();
			foreach (PrivateDialogModel dialog in privateDialogs.Result)
			{
				int id;
				if (dialog.FirstUserId != responseSenderUserId) { id = dialog.FirstUserId; }
				else { id = dialog.SecondUserId; }

				privateDialogDTOs.Add(PrivateDialogModelToDTO(dialog, id));
			}

			IList<GroupDialogDTO> groupDialogDTOs = new List<GroupDialogDTO>();
			foreach (GroupDialogModel dialog in groupDialogs.Result)
			{
				groupDialogDTOs.Add(GroupDialogModelToDTO(dialog));
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

		public Task<PrivateDialogModel?> GetPrivateDialogAsync(int firstId, int secondId)
		{
			return this.UoW.PrivateDialogRepository.GetByUserIdsAsync(firstId, secondId);
		}

		public Task<GroupDialogModel?> GetGroupDialogAsync(int groupId)
		{
			return this.UoW.GroupDialogRepository.GetByIdAsync(groupId);
		}

		public PrivateDialogDTO PrivateDialogModelToDTO(PrivateDialogModel model, int userId)
		{
			if (userId != model.FirstUserId && userId != model.SecondUserId)
			{ throw new ArgumentException("bad create private dialog dto"); }

			string login;
			string? avatarUrl;
			if (userId == model.FirstUserId)
			{
				login = model.FirstUser.Login;
				avatarUrl = model.FirstUser.AvatarUrl;
			}
			else
			{
				login = model.SecondUser.Login;
				avatarUrl = model.SecondUser.AvatarUrl;
			}
			return new PrivateDialogDTO
			{
				UserId = userId,
				Messages = model.Messages.Select(x => new MessageDTO
				{
					SenderUser = x.SenderUser,
					Text = x.Text,
					Attachments = x.Attachments,
					SentAtTotalMilliseconds = Utils.GetTotalMilliseconds(x.SentAt)
				}),
				Name = login,
				UserAvatarUrl = avatarUrl,
				LastUpdateTotalMilliseconds = Utils.GetTotalMilliseconds(model.LastUpdate)
			};
		}

		public GroupDialogDTO GroupDialogModelToDTO(GroupDialogModel model)
		{
			return new GroupDialogDTO
			{
				GroupId = model.Id,
				UserIds = model.Users.Select(x => x.Id),
				Messages = model.Messages.Select(x => new MessageDTO
				{
					SenderUser = x.SenderUser,
					Text = x.Text,
					Attachments = x.Attachments,
					SentAtTotalMilliseconds = Utils.GetTotalMilliseconds(x.SentAt)
				}),
				GroupAvatarUrl = model.AvatarUrl,
				Name = model.Name,
				LastUpdateTotalMilliseconds = Utils.GetTotalMilliseconds(model.LastUpdate)
			};
		}

		private async Task<PrivateDialogModel> CreatePrivateDialogAsync(UserModel firstUser, UserModel secondUser)
		{
			PrivateDialogModel dialog = new()
			{
				FirstUserId = firstUser.Id,
				SecondUserId = secondUser.Id,
				FirstUser = firstUser,
				SecondUser = secondUser,
				Messages = new List<MessageModel>(),
				LastUpdate = DateTime.Now,
			};
			await this.UoW.PrivateDialogRepository.AddAsync(dialog);
			await this.UoW.PrivateDialogRepository.SaveAsync();

			return dialog;
		}
	}
}
