using back.Entities.Db.Dialog;

namespace back.Entities.DTOs.Chat
{
	public class SendMessageContainerDTO
	{
		public int ToId { get; set; }

		public DialogTypes Type { get; set; }

		public SendMessageDTO Message { get; set; }
	}
}
