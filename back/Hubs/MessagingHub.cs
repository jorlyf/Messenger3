using Microsoft.AspNetCore.SignalR;
using Microsoft.AspNetCore.Authorization;
using back.Entities.DTOs.Messaging;
using back.Services;
using back.Entities;
using back.Infrastructure;

namespace back.Hubs
{
	[Authorize]
	public class MessagingHub : Hub<IMessagingHubClient>
	{
		public override Task OnConnectedAsync()
		{
			if (this.Context.User == null) return base.OnConnectedAsync();

			int userId = Utils.GetAuthorizedUserId(this.Context.User);
			if (!MessagingService.ConnectUser(this.Context.ConnectionId, userId))
			{
				this.Context.Abort();
			}
			return base.OnConnectedAsync();
		}
		public override Task OnDisconnectedAsync(Exception? exception)
		{
			if (this.Context.User == null) return base.OnDisconnectedAsync(exception);

			int userId = Utils.GetAuthorizedUserId(this.Context.User);
			MessagingService.DisconnectUser(this.Context.ConnectionId, userId);
			return base.OnDisconnectedAsync(exception);
		}
	}
}
