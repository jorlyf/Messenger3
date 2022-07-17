using System.ComponentModel.DataAnnotations;

namespace back.Models
{
	public class UserModel
	{
		[Required]
		public int Id { get; set; }

		[Required]
		[StringLength(maximumLength: 20, MinimumLength = 4)]
		public string Login { get; set; }

		[Required]
		[StringLength(maximumLength: 20, MinimumLength = 2)]
		public string Username { get; set; }

		[Required]
		[StringLength(maximumLength: 20, MinimumLength = 5)]
		public string Password { get; set; }

		public string? AvatarUrl { get; set; }
	}
}
