using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;

namespace back.Entities.Db.User
{
	[Index(nameof(Login), IsUnique = true)]
	public class UserModel
	{
		[Key]
		public int Id { get; set; }

		[Required]
		[StringLength(maximumLength: 20, MinimumLength = 4)]
		public string Login { get; set; }

		[Required]
		[StringLength(maximumLength: 20, MinimumLength = 5)]
		public string Password { get; set; }

		public string? AvatarUrl { get; set; }
	}
}
