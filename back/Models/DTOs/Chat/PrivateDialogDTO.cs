using System.ComponentModel.DataAnnotations;

namespace back.Models.DTOs.Chat
{
	public class PrivateDialogDTO
	{
		[Required]
		public UserModel User { get; set; }

		[Required]
		public IEnumerable<MessageModel> Messages { get; set; }

		[Required]
		public long LastUpdateTotalSeconds { get; set; }
	}
}
