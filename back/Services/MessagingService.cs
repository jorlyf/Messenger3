using Microsoft.AspNetCore.SignalR;
using back.Hubs;
using back.Entities.DTOs.Chat;
using back.Entities.DTOs.Messaging;
using back.Entities.Db.User;
using back.Entities.Db.Dialog;

namespace back.Services
{
	public class MessagingService
	{
		public static SynchronizedCollection<MessagingUser> ActiveUsers { get; set; } = new();
		private IHubContext<MessagingHub, IMessagingHubClient> MessagingHubContext { get; }

		public MessagingService(IHubContext<MessagingHub, IMessagingHubClient> messagingHubContext)
		{
			this.MessagingHubContext = messagingHubContext;
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
	}
}
