using back.Services;
using Microsoft.AspNetCore.SignalR;

namespace back.Hubs
{
	public class NotificationHub : Hub<INotificationHubClient>
	{
		private NotificationService NotificationService { get; set; }
		public NotificationHub(NotificationService notificationService)
		{
			this.NotificationService = notificationService;
			this.NotificationService.OnSendMessage += SendNewMessageNotification;
		}



		public void SendNewMessageNotification()
		{

		}
	}
}
