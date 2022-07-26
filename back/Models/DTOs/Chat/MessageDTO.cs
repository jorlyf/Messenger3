using System.ComponentModel.DataAnnotations;

namespace back.Models.DTOs.Chat
{
	public class MessageDTO
	{
		[Required]
		public UserModel SenderUser { get; set; }

		public string? Text { get; set; }

		public IEnumerable<AttachmentModel>? Attachments { get; set; }

		[Required]
		public long SentAtTotalMilliseconds { get; set; }
	}
}
