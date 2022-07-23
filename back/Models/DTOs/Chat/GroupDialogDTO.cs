using System.ComponentModel.DataAnnotations;

namespace back.Models.DTOs.Chat
{
	public class GroupDialogDTO
	{
		[Required]
		public int GroupId { get; set; }

		[Required]
		public IEnumerable<UserModel> Users { get; set; }

		[Required]
		public IEnumerable<MessageModel> Messages { get; set; }

		[Required]
		public string Name { get; set; }

		public string? GroupAvatarUrl { get; set; }

		[Required]
		public long LastUpdateTotalSeconds { get; set; }
	}
}
