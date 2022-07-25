namespace back.Infrastructure.Exceptions
{
	public class ApiException : Exception
	{
		public ApiExceptionReason Reason { get; set; }

		public ApiException(ApiExceptionReason reason)
		{
			this.Reason = reason;
		}
		public ApiException(ApiExceptionReason reason, string message) : base(message)
		{
			this.Reason= reason;
		}
	}
}
