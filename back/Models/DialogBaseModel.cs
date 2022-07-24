using System.ComponentModel.DataAnnotations;

namespace back.Models
{
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
