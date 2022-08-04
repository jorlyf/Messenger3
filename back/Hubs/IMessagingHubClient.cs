using back.Entities.DTOs.Messaging;

namespace back.Hubs
{
	public interface IMessagingHubClient
	{
		Task ReceiveNewMessage(NewMessageDTO newMessageDTO);
	}
}
