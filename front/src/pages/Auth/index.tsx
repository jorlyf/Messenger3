import * as React from "react";
import InputField from "../../components/InputField";
import useAuthPage, { Mode } from "./useAuthPage";

import styles from "./Auth.module.css";

const Auth: React.FC = () => {

  const {
    mode,
    wasInitAuthAttempt,
    isAuthorized,
    login,
    setLogin,
    isLogging,
    password,
    setPassword,
    handleSubmitLogin,
    handleSubmitRegistrate,
    handleChangeMode
  } = useAuthPage();

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
              disabled={isLogging || isAuthorized}
            />
            <InputField
              value={password}
              setValue={setPassword}
              placeholder={"Пароль"}
              isOneRow={true}
              disabled={isLogging || isAuthorized}
            />
          </div>
          {mode === Mode.login &&
            <>
              <button disabled={isLogging || isAuthorized} onClick={handleSubmitLogin} className={styles.submit}>Войти</button>
              <a onClick={() => handleChangeMode(Mode.registrate)} className={styles.changeMode}>У меня нет аккаунта</a>
            </>
          }
          {mode === Mode.registrate &&
            <>
              <button disabled={isLogging || isAuthorized} onClick={handleSubmitRegistrate} className={styles.submit}>Зарегистрироваться</button>
              <a onClick={() => handleChangeMode(Mode.login)} className={styles.changeMode}>У меня есть аккаунт</a>
            </>
          }
        </div>
      }
    </div>
  );
}

export default Auth;