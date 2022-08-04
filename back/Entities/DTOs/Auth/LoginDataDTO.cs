using System.ComponentModel.DataAnnotations;

namespace back.Entities.DTOs.Auth
{
	public class LoginDataDTO
	{
		[Required]
		[StringLength(maximumLength: 20, MinimumLength = 4)]
		public string Login { get; set; }

		[Required]
		[StringLength(maximumLength: 20, MinimumLength = 5)]
		public string Password { get; set; }
	}
}
