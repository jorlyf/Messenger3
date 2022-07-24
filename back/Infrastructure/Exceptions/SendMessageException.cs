namespace back.Infrastructure.Exceptions
{
	public enum SendMessageExceptionReasons
	{
		UnexpectedError,
		UserIsNotFound,
		SenderUserIsReceiver
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
