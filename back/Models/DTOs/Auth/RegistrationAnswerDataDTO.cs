using back.Infrastructure.Exceptions;

namespace back.Models.DTOs.Auth
{
	public class RegistrationAnswerDataDTO
	{
		public bool IsSuccess { get; set; }

		public string? Token { get; set; }

		public RegistrationExceptionReasons? ExceptionReason { get; set; }
	}
}
