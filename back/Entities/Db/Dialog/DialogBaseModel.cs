using System.ComponentModel.DataAnnotations;
using back.Entities.Db.Message;

namespace back.Entities.Db.Dialog
{
	public enum DialogTypes : byte
	{
		Private,
		Group
	}
	public abstract class DialogBaseModel
	{
		[Key]
		public int Id { get; set; }

		[Required]
		public IList<MessageModel> Messages { get; set; }

		[Required]
		public DateTime LastUpdate { get; set; }
	}
}
