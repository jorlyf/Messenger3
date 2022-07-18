namespace back.Infrastructure.Exceptions
{
	public enum RegistrationExceptionReasons
	{
		LoginIsNotUnique
	}
	public class RegistrationException : Exception
	{
		public RegistrationExceptionReasons Reason { get; }
		public RegistrationException(RegistrationExceptionReasons reason)
		{
			this.Reason = reason;
		}
		public RegistrationException(RegistrationExceptionReasons reason, string message) : base(message)
		{
			this.Reason = reason;
		}
	}
}
