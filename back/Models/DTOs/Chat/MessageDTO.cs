namespace back.Models.DTOs.Chat
{
	public class MessageDTO
	{
		public string? Text { get; set; }

		public IEnumerable<AttachmentDTO>? Attachments { get; set; }
	}
}
