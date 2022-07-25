namespace back.Infrastructure.Exceptions
{
	public enum ApiExceptionReason
	{
		UserIsNotFound,
		IncorrectLoginData,
		LoginIsNotUnique,
		SenderUserIsReceiver,
		DialogIsNotFound,
	}
}
