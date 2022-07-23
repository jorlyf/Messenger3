using System.ComponentModel.DataAnnotations;

namespace back.Models
{
	public class PrivateDialogModel : DialogBaseModel
	{
		[Required]
		public int FirstUserId { get; set; }

		[Required]
		public int SecondUserId { get; set; }
	}
}
