import * as React from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import useAppSelector from "../../hooks/useAppSelector";
import AuthService from "../../services/AuthService";
import LoginDataDTO from "../../entities/dtos/LoginDataDTO";
import RegistrationDataDTO from "../../entities/dtos/RegistrationDataDTO";

export enum Mode {
  login,
  registrate
}

const useAuthPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [mode, setMode] = React.useState<Mode>(Mode.login);

  const [login, setLogin] = React.useState<string>("");
  const [password, setPassword] = React.useState<string>("");

  const isLogging = useAppSelector(state => state.auth.isLogging);
  const isAuthorized = useAppSelector(state => state.auth.isAuthorized);
  const wasInitAuthAttempt = useAppSelector(state => state.auth.wasInitAuthAttempt);

  const clearInputs = () => {
    setLogin("");
    setPassword("");
  }

  const handleChangeMode = (newMode: Mode) => {
    setMode(newMode);
  }

  const handleSubmitLogin = () => {
    const loginData: LoginDataDTO = { login, password }
    AuthService.login(dispatch, loginData);
  }

  const handleSubmitRegistrate = () => {
    const registrationData: RegistrationDataDTO = { login, password }
    AuthService.registrate(dispatch, registrationData);
  }

  React.useEffect(() => {
    if (isAuthorized) { navigate("/"); }
  }, [isAuthorized, navigate]);

  return {
    mode,
    wasInitAuthAttempt,
    isLogging,
    login,
    setLogin,
    password,
    setPassword,
    handleChangeMode,
    handleSubmitLogin,
    handleSubmitRegistrate
  }
}

export default useAuthPage;