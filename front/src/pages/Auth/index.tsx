import * as React from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import useAppSelector from "../../hooks/useAppSelector";
import InputField from "../../components/InputField";
import AuthService from "../../services/AuthService";
import LoginDataDTO from "../../models/dtos/LoginDataDTO";

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
  const [username, setUsername] = React.useState<string>("");
  const [password, setPassword] = React.useState<string>("");

  const isLogging = useAppSelector(state => state.auth.isLogging);
  const isAuthorized = useAppSelector(state => state.auth.isAuthorized);

  const clearInputs = () => {
    setLogin("");
    setUsername("");
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
    
  }

  React.useEffect(() => {
    if (isAuthorized) { navigate("/"); }
  }, [isAuthorized, navigate]);

  return (
    <div>
      <div className={styles.form}>
        {mode === Mode.login && (
          <>
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
            <button onClick={handleLogin} className={styles.submit}>Войти</button>
            <a onClick={() => handleChangeMode(Mode.registrate)} className={styles.changeMode}>У меня нет аккаунта</a>
          </>
        )}

        {mode === Mode.registrate && (
          <>
            <div className={styles.inputs}>
              <InputField
                value={login}
                setValue={setLogin}
                placeholder={"Логин"}
                isOneRow={true}
                disabled={isLogging}
              />
              <InputField
                value={username}
                setValue={setUsername}
                placeholder={"Имя"}
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
            <button onClick={handleRegistrate} className={styles.submit}>Зарегистрироваться</button>
            <a onClick={() => handleChangeMode(Mode.login)} className={styles.changeMode}>Я уже зарегистрирован</a>
          </>
        )}
      </div>
    </div>
  );
}

export default Auth;