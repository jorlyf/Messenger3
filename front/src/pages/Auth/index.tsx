import * as React from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import useAppSelector from "../../hooks/useAppSelector";
import InputField from "../../components/InputField";
import AuthService from "../../services/AuthService";
import LoginDataDTO from "../../entities/dtos/LoginDataDTO";
import RegistrationDataDTO from "../../entities/dtos/RegistrationDataDTO";

import styles from "./Auth.module.css";

enum Mode {
  login,
  registrate
}

const Auth: React.FC = () => {
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

  const handleLogin = () => {
    const loginData: LoginDataDTO = { login, password }
    AuthService.login(dispatch, loginData);
  }

  const handleRegistrate = () => {
    const registrationData: RegistrationDataDTO = { login, password }
    AuthService.registrate(dispatch, registrationData);
  }

  React.useEffect(() => {
    if (isAuthorized) { navigate("/"); }
  }, [isAuthorized, navigate]);

  return (
    <div>
      {wasInitAuthAttempt &&
        <div className={styles.form}>
          <div className={styles.inputs}>
            <InputField
              value={login}
              setValue={setLogin}
              placeholder={"Логин"}
              isOneRow={true}
              disabled={isLogging}
            />
            <InputField
              value={password}
              setValue={setPassword}
              placeholder={"Пароль"}
              isOneRow={true}
              disabled={isLogging}
            />
          </div>
          {mode === Mode.login &&
            <>
              <button onClick={handleLogin} className={styles.submit}>Войти</button>
              <a onClick={() => handleChangeMode(Mode.registrate)} className={styles.changeMode}>У меня нет аккаунта</a>
            </>
          }
          {mode === Mode.registrate &&
            <>
              <button onClick={handleRegistrate} className={styles.submit}>Зарегистрироваться</button>
              <a onClick={() => handleChangeMode(Mode.login)} className={styles.changeMode}>У меня есть аккаунт</a>
            </>
          }
        </div>
      }
    </div>
  );
}

export default Auth;