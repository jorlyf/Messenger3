using System.ComponentModel.DataAnnotations;

namespace back.Models
{
	public class GroupDialogModel : DialogBaseModel
	{
		[Required]
		public IEnumerable<UserModel> Users { get; set; }

		[Required]
		public string Name { get; set; }

		public string? AvatarUrl { get; set; }
	}
}
