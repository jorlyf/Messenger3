enum LoginExceptionReasons {
  UserIsNotFound = 0,
  IncorrectLoginData = 1
}

export default interface LoginAnswerDataDTO {
  status: number;
  token?: string;
  ExceptionReason?: LoginExceptionReasons;
}