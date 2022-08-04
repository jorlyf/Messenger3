using System.ComponentModel.DataAnnotations;
using back.Entities.Db.Message;
using back.Entities.Db.User;

namespace back.Entities.DTOs.Chat
{
	public class MessageDTO
	{
		[Required]
		public UserModel SenderUser { get; set; }

		public string? Text { get; set; }

		[Required]
		public IEnumerable<AttachmentModel> Attachments { get; set; }

		[Required]
		public long SentAtTotalMilliseconds { get; set; }
	}
}
