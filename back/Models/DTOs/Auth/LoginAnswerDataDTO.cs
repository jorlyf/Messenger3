using back.Infrastructure.Exceptions;

namespace back.Models.DTOs.Auth
{
	public class LoginAnswerDataDTO
	{
		public bool IsSuccess { get; set; }

		public string? Token { get; set; }

		public LoginExceptionReasons? ExceptionReason { get; set; }
	}
}
