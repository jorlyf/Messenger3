using Microsoft.AspNetCore.SignalR;
using System.ComponentModel.DataAnnotations;
using back.Hubs;
using back.Entities.DTOs.Chat;
using back.Entities.DTOs.Messaging;
using back.Entities.Db.User;
using back.Entities.Db.Dialog;
using back.Entities.Db.Message;
using back.Infrastructure;
using back.Infrastructure.Exceptions;
using back.Repositories;
using Microsoft.EntityFrameworkCore;

namespace back.Services
{
	public class MessageService
	{
		private UnitOfWork UoW { get; }
		private DialogService DialogService { get; }
		private FileService FileService { get; }

		public static SynchronizedCollection<MessagingUser> ActiveUsers { get; set; } = new();
		private IHubContext<MessagingHub, IMessagingHubClient> MessagingHubContext { get; }

		public MessageService(UnitOfWork uow, DialogService dialogService, FileService fileService, IHubContext<MessagingHub, IMessagingHubClient> messagingHubContext)
		{
			this.UoW = uow;
			this.DialogService = dialogService;
			this.FileService = fileService;
			this.MessagingHubContext = messagingHubContext;
		}

		public async Task<MessageDTO> SendMessageToUserAsync(int senderId, SendMessageContainerDTO messageContainerDTO)
		{
			if (!ValidateSendMessageDTO(messageContainerDTO.SendMessageDTO)) { throw new ApiException(ApiExceptionReason.MessageIsNotValid); }

			if (senderId == messageContainerDTO.ToDialogId)
			{ throw new ApiException(ApiExceptionReason.SenderUserIsReceiver); }

			Task<UserModel?> senderUserTask = this.UoW.UserRepository.GetById(senderId).FirstOrDefaultAsync();
			Task<UserModel?> receiveUserTask = this.UoW.UserRepository.GetById(messageContainerDTO.ToDialogId).FirstOrDefaultAsync();
			Task<PrivateDialogModel?> dialogTask = this.UoW.PrivateDialogRepository
				.GetByUserIds(senderId, messageContainerDTO.ToDialogId)
				.Include(x => x.Messages)
				.FirstOrDefaultAsync();

			Task.WaitAll(senderUserTask, receiveUserTask, dialogTask);
			UserModel? senderUser = senderUserTask.Result;
			UserModel? receiveUser = receiveUserTask.Result;
			if (senderUser == null || receiveUser == null)
			{ throw new ApiException(ApiExceptionReason.UserIsNotFound); }

			PrivateDialogModel? dialog = dialogTask.Result;
			if (dialog == null)
			{ dialog = await this.DialogService.CreatePrivateDialogAsync(senderUser, receiveUser); }

			string? messageText = messageContainerDTO.SendMessageDTO.Text;
			IEnumerable<AttachmentModel> attachments = Enumerable.Empty<AttachmentModel>();
			if (messageContainerDTO.SendMessageDTO.SendAttachmentDTOs != null && messageContainerDTO.SendMessageDTO.SendAttachmentDTOs.Any())
			{ attachments = await this.FileService.SaveMessageAttachmentsAsync(messageContainerDTO.SendMessageDTO.SendAttachmentDTOs); }

			MessageModel messageModel = new()
			{
				SenderUser = senderUser,
				Text = messageText,
				Attachments = attachments,
				SentAt = DateTime.Now
			};

			if (!Validator.TryValidateObject(messageModel, new ValidationContext(messageModel), new List<ValidationResult>(), true))
			{
				throw new ApiException(ApiExceptionReason.MessageIsNotValid);
			}

			dialog.Messages.Add(messageModel);
			dialog.LastUpdate = DateTime.Now;
			this.UoW.PrivateDialogRepository.Update(dialog);
			await this.UoW.PrivateDialogRepository.SaveAsync();

			MessageDTO messageDTO = MessageModelToDTO(messageModel);

			NotifyNewMessage(dialog.Id, DialogTypes.Private, messageDTO);

			return messageDTO;
		}
		public async Task<MessageDTO> SendMessageToGroupAsync(int senderId, SendMessageContainerDTO messageContainerDTO)
		{
			if (!ValidateSendMessageDTO(messageContainerDTO.SendMessageDTO)) { throw new ApiException(ApiExceptionReason.MessageIsNotValid); }

			Task<UserModel?> senderUserTask = this.UoW.UserRepository.GetById(senderId).FirstOrDefaultAsync();
			Task<GroupDialogModel?> dialogTask = this.UoW.GroupDialogRepository
				.GetById(messageContainerDTO.ToDialogId)
				.Include(x => x.Messages)
				.FirstOrDefaultAsync();

			Task.WaitAll(senderUserTask, dialogTask);
			UserModel? senderUser = senderUserTask.Result;
			if (senderUser == null) { throw new ApiException(ApiExceptionReason.UserIsNotFound); }

			GroupDialogModel? dialog = dialogTask.Result;
			if (dialog == null) { throw new ApiException(ApiExceptionReason.DialogIsNotFound); }

			string? messageText = messageContainerDTO.SendMessageDTO.Text;
			ICollection<AttachmentModel> attachments = new List<AttachmentModel>();
			if (messageContainerDTO.SendMessageDTO.SendAttachmentDTOs != null && messageContainerDTO.SendMessageDTO.SendAttachmentDTOs.Any())
			{ attachments = await this.FileService.SaveMessageAttachmentsAsync(messageContainerDTO.SendMessageDTO.SendAttachmentDTOs); }

			MessageModel messageModel = new()
			{
				SenderUser = senderUser,
				Text = messageText,
				Attachments = attachments,
				SentAt = DateTime.Now
			};

			if (!Validator.TryValidateObject(messageModel, new ValidationContext(messageModel), new List<ValidationResult>(), true))
			{
				throw new ApiException(ApiExceptionReason.MessageIsNotValid);
			}

			dialog.Messages.Add(messageModel);
			dialog.LastUpdate = DateTime.Now;
			this.UoW.GroupDialogRepository.Update(dialog);
			await this.UoW.GroupDialogRepository.SaveAsync();

			MessageDTO messageDTO = MessageModelToDTO(messageModel);

			NotifyNewMessage(dialog.Id, DialogTypes.Group, messageDTO);

			return messageDTO;
		}

		public async Task<IEnumerable<MessageDTO>> GetMoreDialogMessageDTOsAsync(int dialogId, DialogTypes dialogType, int oldestId, int limit)
		{
			DialogBaseModel? dialog = null;
			switch (dialogType)
			{
				case DialogTypes.Private:
					dialog = await this.UoW.PrivateDialogRepository
						.GetById(dialogId)
						.Include(x => x.Messages)
							.ThenInclude(x => x.Attachments)
						.Include(x => x.Messages)
							.ThenInclude(x => x.SenderUser)
						.FirstOrDefaultAsync();
					break;
				case DialogTypes.Group:
					dialog = await this.UoW.GroupDialogRepository
						.GetById(dialogId)
						.Include(x => x.Messages)
							.ThenInclude(x => x.Attachments)
						.Include(x => x.Messages)
							.ThenInclude(x => x.SenderUser)
						.FirstOrDefaultAsync();
					break;
			}
			if (dialog == null) { throw new ApiException(ApiExceptionReason.DialogIsNotFound); }

			IList<MessageModel> messages = dialog.Messages
				.Where(x => x.Id < oldestId)
				.OrderBy(x => x.Id)
				.TakeLast(limit)
				.ToList();

			IEnumerable<MessageDTO> messageDTOs = messages.Select(x => MessageModelToDTO(x));
			return messageDTOs;
		}

		public void NotifyNewMessage(int dialogId, DialogTypes dialogType, MessageDTO messageDTO)
		{
			MessagingUser? user = ActiveUsers.Where(x => x.UserId == messageDTO.SenderUser.Id).FirstOrDefault();

			NewMessageDTO newMessageDTO;
			if (dialogType == DialogTypes.Private)
			{
				newMessageDTO = new()
				{
					DialogId = messageDTO.SenderUser.Id,
					DialogType = dialogType,
					MessageDTO = messageDTO
				};
			}
			else
			{
				newMessageDTO = new()
				{
					DialogId = dialogId,
					DialogType = dialogType,
					MessageDTO = messageDTO
				};
			}

			if (user != null)
			{ this.MessagingHubContext.Clients.AllExcept(user.ConnectionId).ReceiveNewMessage(newMessageDTO); }
			else
			{ this.MessagingHubContext.Clients.All.ReceiveNewMessage(newMessageDTO); }
		}

		public static MessageDTO MessageModelToDTO(MessageModel model)
		{
			return new MessageDTO()
			{
				Id = model.Id,
				SenderUser = model.SenderUser,
				Text = model.Text,
				AttachmentDTOs = model.Attachments.Select(x => new AttachmentDTO
				{
					Id = x.Id,
					Type = x.Type,
					Url = x.Url
				}),
				SentAtTotalMilliseconds = Utils.GetTotalMilliseconds(model.SentAt)
			};
		}

		private static bool ValidateSendMessageDTO(SendMessageDTO messageDTO)
		{
			if (string.IsNullOrEmpty(messageDTO.Text) && !messageDTO.SendAttachmentDTOs.Any())
				return false;

			return true;
		}

		#region SignalR connection
		public static bool ConnectUser(string connectionId, int userId)
		{
			if (ActiveUsers.Any(x => x.ConnectionId == connectionId || x.UserId == userId))
				return false;

			MessagingUser user = new()
			{
				UserId = userId,
				ConnectionId = connectionId
			};

			ActiveUsers.Add(user);
			return true;
		}
		public static void DisconnectUser(string connectionId, int userId)
		{
			MessagingUser? user = ActiveUsers
				.Where(x => x.ConnectionId == connectionId && x.UserId == userId)
				.FirstOrDefault();
			if (user == null) return;

			ActiveUsers.Remove(user);
		}
		#endregion
	}
}
