import * as React from "react";
import InputField from "../../components/InputField";

import styles from "./Auth.module.css";

enum Mode {
  login,
  registrate
}

const Auth: React.FC = () => {

  const [mode, setMode] = React.useState<Mode>(Mode.login);

  const [login, setLogin] = React.useState<string>("");
  const [username, setUsername] = React.useState<string>("");
  const [password, setPassword] = React.useState<string>("");

  const clearInputs = () => {
    setLogin("");
    setUsername("");
    setPassword("");
  }

  const handleChangeMode = (newMode: Mode) => {
    setMode(newMode);
  }

  const handleLogin = () => {

  }

  const handleRegistrate = () => {

  }

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
              />
              <InputField
                value={password}
                setValue={setPassword}
                placeholder={"Пароль"}
                isOneRow={true}
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
              />
              <InputField
                value={username}
                setValue={setUsername}
                placeholder={"Имя"}
                isOneRow={true}
              />
              <InputField
                value={password}
                setValue={setPassword}
                placeholder={"Пароль"}
                isOneRow={true}
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