using System.ComponentModel.DataAnnotations;
using back.Entities.Db.User;

namespace back.Entities.Db.Dialog
{
	public class PrivateDialogModel : DialogBaseModel
	{
		[Required]
		public int FirstUserId { get; set; }

		[Required]
		public int SecondUserId { get; set; }

		[Required]
		public UserModel FirstUser { get; set; }

		[Required]
		public UserModel SecondUser { get; set; }
	}
}
