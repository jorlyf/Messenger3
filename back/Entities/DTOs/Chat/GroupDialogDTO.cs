using System.ComponentModel.DataAnnotations;

namespace back.Entities.DTOs.Chat
{
	public class GroupDialogDTO
	{
		[Required]
		public int GroupId { get; set; }

		[Required]
		public IEnumerable<int> UserIds { get; set; }

		[Required]
		public IEnumerable<MessageDTO> Messages { get; set; }

		[Required]
		public int TotalMessagesCount { get; set; }

		[Required]
		public string Name { get; set; }

		public string? GroupAvatarUrl { get; set; }

		[Required]
		public long LastUpdateTotalMilliseconds { get; set; }
	}
}
