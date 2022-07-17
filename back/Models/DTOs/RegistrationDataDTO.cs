using System.ComponentModel.DataAnnotations;

namespace back.Models.DTOs
{
	public class RegistrationDataDTO
	{
		[Required]
		[StringLength(maximumLength: 20, MinimumLength = 4)]
		public string Login { get; set; }

		[Required]
		[StringLength(maximumLength: 20, MinimumLength = 2)]
		public string Username { get; set; }

		[Required]
		[StringLength(maximumLength: 20, MinimumLength = 5)]
		public string Password { get; set; }
	}
}
