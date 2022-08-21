using System.ComponentModel.DataAnnotations;

namespace back.Entities.DTOs.Chat
{
	public class SendMessageDTO
	{
		[StringLength(4096)]
		public string? Text { get; set; }

		[Required]
		public IEnumerable<SendAttachmentDTO> SendAttachmentDTOs { get; set; }
	}
}
