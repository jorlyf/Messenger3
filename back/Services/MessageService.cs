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

namespace back.Services
{
	public class MessageService
	{
		private AsyncUnitOfWork UoW { get; }
		private DialogService DialogService { get; }
		private FileService FileService { get; }

		public static SynchronizedCollection<MessagingUser> ActiveUsers { get; set; } = new();
		private IHubContext<MessagingHub, IMessagingHubClient> MessagingHubContext { get; }

		public MessageService(AsyncUnitOfWork uow, DialogService dialogService, FileService fileService, IHubContext<MessagingHub, IMessagingHubClient> messagingHubContext)
		{
			this.UoW = uow;
			this.DialogService = dialogService;
			this.FileService = fileService;
			this.MessagingHubContext = messagingHubContext;
		}

		public async Task<MessageDTO> SendMessageToUserAsync(int senderId, SendMessageContainerDTO messageContainerDTO)
		{
			if (!ValidateSendMessageDTO(messageContainerDTO.Message)) { throw new ApiException(ApiExceptionReason.MessageIsNotValid); }

			if (senderId == messageContainerDTO.ToId)
			{ throw new ApiException(ApiExceptionReason.SenderUserIsReceiver); }

			Task<UserModel?> senderUserTask = this.UoW.UserRepository.GetByIdAsync(senderId);
			Task<UserModel?> receiveUserTask = this.UoW.UserRepository.GetByIdAsync(messageContainerDTO.ToId);
			Task<PrivateDialogModel?> dialogTask = this.DialogService.GetPrivateDialogAsync(senderId, messageContainerDTO.ToId);

			Task.WaitAll(senderUserTask, receiveUserTask, dialogTask);
			UserModel? senderUser = senderUserTask.Result;
			UserModel? receiveUser = receiveUserTask.Result;
			if (senderUser == null || receiveUser == null)
			{ throw new ApiException(ApiExceptionReason.UserIsNotFound); }

			PrivateDialogModel? dialog = dialogTask.Result;
			if (dialog == null)
			{ dialog = await this.DialogService.CreatePrivateDialogAsync(senderUser, receiveUser); }

			string? messageText = messageContainerDTO.Message.Text;
			IEnumerable<AttachmentModel> attachments = Enumerable.Empty<AttachmentModel>();
			if (messageContainerDTO.Message.Attachments != null && messageContainerDTO.Message.Attachments.Any())
			{ attachments = await this.FileService.SaveMessageAttachmentsAsync(messageContainerDTO.Message.Attachments); }

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
			await this.UoW.PrivateDialogRepository.UpdateAsync(dialog);
			await this.UoW.PrivateDialogRepository.SaveAsync();

			MessageDTO messageDTO = MessageModelToDTO(messageModel);

			NotifyNewMessage(dialog.Id, DialogTypes.Private, messageDTO);

			return messageDTO;
		}
		public async Task<MessageDTO> SendMessageToGroupAsync(int senderId, SendMessageContainerDTO messageContainerDTO)
		{
			if (!ValidateSendMessageDTO(messageContainerDTO.Message)) { throw new ApiException(ApiExceptionReason.MessageIsNotValid); }

			Task<UserModel?> senderUserTask = this.UoW.UserRepository.GetByIdAsync(senderId);
			Task<GroupDialogModel?> dialogTask = this.UoW.GroupDialogRepository.GetByIdAsync(messageContainerDTO.ToId);

			Task.WaitAll(senderUserTask, dialogTask);
			UserModel? senderUser = senderUserTask.Result;
			if (senderUser == null) { throw new ApiException(ApiExceptionReason.UserIsNotFound); }

			GroupDialogModel? dialog = dialogTask.Result;
			if (dialog == null) { throw new ApiException(ApiExceptionReason.DialogIsNotFound); }

			string? messageText = messageContainerDTO.Message.Text;
			IEnumerable<AttachmentModel> attachments = Enumerable.Empty<AttachmentModel>();
			if (messageContainerDTO.Message.Attachments != null && messageContainerDTO.Message.Attachments.Any())
			{ attachments = await this.FileService.SaveMessageAttachmentsAsync(messageContainerDTO.Message.Attachments); }

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
			await this.UoW.GroupDialogRepository.UpdateAsync(dialog);
			await this.UoW.GroupDialogRepository.SaveAsync();

			MessageDTO messageDTO = MessageModelToDTO(messageModel);

			NotifyNewMessage(dialog.Id, DialogTypes.Group, messageDTO);

			return messageDTO;
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

		private MessageDTO MessageModelToDTO(MessageModel model)
		{
			return new MessageDTO()
			{
				SenderUser = model.SenderUser,
				Text = model.Text,
				Attachments = model.Attachments,
				SentAtTotalMilliseconds = Utils.GetTotalMilliseconds(model.SentAt)
			};
		}

		private bool ValidateSendMessageDTO(SendMessageDTO messageDTO)
		{
			if (string.IsNullOrEmpty(messageDTO.Text) && (messageDTO.Attachments == null || !messageDTO.Attachments.Any()))
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
