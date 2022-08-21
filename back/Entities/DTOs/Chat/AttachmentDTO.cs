using back.Entities.Db.Message;
using System.ComponentModel.DataAnnotations;

namespace back.Entities.DTOs.Chat
{
	public class AttachmentDTO
	{
		[Required]
		public int Id { get; set; }

		[Required]
		public AttachmentTypes Type { get; set; }

		[Required]
		public string Url { get; set; }
	}
}
