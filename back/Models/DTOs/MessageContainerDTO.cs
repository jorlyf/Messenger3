using back.Models.DTOs.Chat;

namespace back.Models.DTOs
{
	public class MessageContainerDTO
	{
		public int ToId { get; set; }

		public MessageDTO Message { get; set; }
	}
}
