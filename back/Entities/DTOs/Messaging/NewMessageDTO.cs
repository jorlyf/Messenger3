using back.Entities.Db.Dialog;
using back.Entities.DTOs.Chat;

namespace back.Entities.DTOs.Messaging
{
	public class NewMessageDTO
	{
		public int DialogId { get; set; }

		public DialogTypes DialogType { get; set; }

		public MessageDTO MessageDTO { get; set; }
	}
}
