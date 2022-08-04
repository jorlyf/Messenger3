using System.ComponentModel.DataAnnotations;

namespace back.Entities.DTOs.Chat
{
	public class PrivateDialogDTO
	{
		[Required]
		public int UserId { get; set; }

		[Required]
		public IEnumerable<MessageDTO> Messages { get; set; }

		[Required]
		public string Name { get; set; }

		public string? UserAvatarUrl { get; set; }

		[Required]
		public long LastUpdateTotalMilliseconds { get; set; }
	}
}
