using System.ComponentModel.DataAnnotations;

namespace back.Entities.DTOs.Chat
{
	public class GroupDialogCreatingDataDTO
	{
		[Required]
		public int UserCreatorId { get; set; }

		[Required]
		public IEnumerable<int> UserIds { get; set; }
	}
}
