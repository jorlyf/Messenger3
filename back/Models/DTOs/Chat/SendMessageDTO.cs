namespace back.Models.DTOs.Chat
{
	public class SendMessageDTO
	{
		public string? Text { get; set; }

		public IEnumerable<AttachmentDTO>? Attachments { get; set; }
	}
}
