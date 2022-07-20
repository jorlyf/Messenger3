using System.ComponentModel.DataAnnotations;

namespace back.Models.DTOs.Chat
{
	public class AttachmentDTO
	{
		[Required]
		public AttachmentTypes Type { get; set; }

		[Required]
		public IFormFile FormFile { get; set; }
	}
}
