using System.ComponentModel.DataAnnotations;

namespace back.Models
{
	public class DialogModel
	{
		[Key]
		public int Id { get; set; }

		[Required]
		public bool IsPrivate { get; set; }

		public string? Name { get; set; }

		public IEnumerable<MessageModel>? Messages { get; set; }

		public IEnumerable<UserModel>? Users { get; set; }
	}
}
