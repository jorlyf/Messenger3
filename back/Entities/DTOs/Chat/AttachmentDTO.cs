using System.ComponentModel.DataAnnotations;
using back.Entities.Db.Message;

namespace back.Entities.DTOs.Chat
{
	public class AttachmentDTO
	{
		[Required]
		public AttachmentTypes Type { get; set; }

		[Required]
		public IFormFile FormFile { get; set; }
	}
}
