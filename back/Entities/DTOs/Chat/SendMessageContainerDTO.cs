using back.Entities.Db.Dialog;
using System.ComponentModel.DataAnnotations;

namespace back.Entities.DTOs.Chat
{
	public class SendMessageContainerDTO
	{
		[Required]
		public int ToDialogId { get; set; }

		[Required]
		public DialogTypes DialogType { get; set; }

		[Required]
		public SendMessageDTO SendMessageDTO { get; set; }
	}
}
