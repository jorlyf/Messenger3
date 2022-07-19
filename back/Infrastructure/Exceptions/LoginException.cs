namespace back.Infrastructure.Exceptions
{
	public enum LoginExceptionReasons : byte
	{
		UserIsNotFound = 0,
		IncorrectLoginData = 1
	}
	public class LoginException : Exception
	{
		public LoginExceptionReasons Reason { get; }
		public LoginException(LoginExceptionReasons reason)
		{
			this.Reason = reason;
		}
		public LoginException(LoginExceptionReasons reason, string message) : base(message)
		{
			this.Reason = reason;
		}
	}
}
