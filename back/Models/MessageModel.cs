using System.ComponentModel.DataAnnotations;

namespace back.Models
{
	public class MessageModel
	{
		[Key]
		public int Id { get; set; }

		[Required]
		public UserModel SenderUser { get; set; }

		[MaxLength(1024)]
		public string? Text { get; set; }

		public IEnumerable<AttachmentModel?>? Attachments { get; set; }
	}
}
