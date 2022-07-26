namespace back.Models.DTOs.Chat
{
	public class SendMessageContainerDTO
	{
		public int ToId { get; set; }

		public SendMessageDTO Message { get; set; }
	}
}
