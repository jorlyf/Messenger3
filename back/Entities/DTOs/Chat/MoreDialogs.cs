using back.Entities.Db.Dialog;
using System.ComponentModel.DataAnnotations;

namespace back.Entities.DTOs.Chat
{
	public class MoreDialogsRequest
	{
		[Required]
		public IEnumerable<Dialog> ExistingDialogs { get; set; }
	}
	public class MoreDialogsAnswer
	{
		[Required]
		public DialogsDTO DialogsDTO { get; set; }

		[Required]
		public int TotalDialogCount { get; set; }
	}
	public class Dialog
	{
		[Required]
		public int Id { get; set; }

		[Required]
		public DialogTypes Type { get; set; }
	}
}
