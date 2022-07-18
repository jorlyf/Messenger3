enum RegistrationExceptionReasons {
  LoginIsNotUnique = 0
}

export default interface RegistrationAnswerDataDTO {
  status: number;
  token?: string;
  ExceptionReason?: RegistrationExceptionReasons;
}