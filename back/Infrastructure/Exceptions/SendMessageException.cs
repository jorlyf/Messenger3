namespace back.Infrastructure.Exceptions
{
	public enum SendMessageExceptionReasons
	{
		UserIsNotFound = 0
	}

	public class SendMessageException : Exception
	{
		public SendMessageExceptionReasons Reason { get; }
		public SendMessageException(SendMessageExceptionReasons reason)
		{
			this.Reason = reason;
		}
	}
}
