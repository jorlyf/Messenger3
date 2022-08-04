using System.ComponentModel.DataAnnotations;
using back.Entities.Db.User;

namespace back.Entities.Db.Dialog
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
