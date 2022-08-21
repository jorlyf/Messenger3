using System.ComponentModel.DataAnnotations;
using back.Entities.Db.User;

namespace back.Entities.DTOs.Chat
{
	public class MessageDTO
	{
		[Required]
		public int Id { get; set; }

		[Required]
		public UserModel SenderUser { get; set; }

		public string? Text { get; set; }

		[Required]
		public IEnumerable<AttachmentDTO> AttachmentDTOs { get; set; }

		[Required]
		public long SentAtTotalMilliseconds { get; set; }
	}
}
