using System.ComponentModel.DataAnnotations;
using back.Entities.Db.User;

namespace back.Entities.Db.Message
{
	public class MessageModel : IEntity
	{
		[Key]
		public int Id { get; set; }

		[Required]
		public UserModel SenderUser { get; set; }

		[StringLength(4096)]
		public string? Text { get; set; }

		//[Range(0, 10)]
		[Required]
		public IEnumerable<AttachmentModel> Attachments { get; set; }

		[Required]
		public DateTime SentAt { get; set; }
	}
}
