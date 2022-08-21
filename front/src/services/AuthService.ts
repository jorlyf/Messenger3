import $api from "../http";
import { AppDispatch } from "../redux/store";
import { loginByTokenSuccess, loginError, loginInit, loginSuccess } from "../redux/slices/authSlice";
import ProfileService from "./ProfileService";
import LoginDataDTO from "../entities/dtos/auth/LoginDataDTO";
import LoginAnswerDataDTO from "../entities/dtos/auth/LoginAnswerDataDTO";
import RegistrationDataDTO from "../entities/dtos/auth/RegistrationDataDTO";
import RegistrationAnswerDataDTO from "../entities/dtos/auth/RegistrationAnswerDataDTO";

export default class AuthService {
  static async loginByToken(dispatch: AppDispatch): Promise<void> {
    try {
      dispatch(loginInit());
      const response = await $api.post<null>("/Auth/LoginByToken");
      AuthService.onLoginByTokenSuccess(dispatch);
    } catch (error: any) {
      dispatch(loginError());
      if (error?.response?.status === 401) {
        localStorage.removeItem("token");
      }
    }
  }
  static async login(dispatch: AppDispatch, loginData: LoginDataDTO): Promise<void> {
    try {
      dispatch(loginInit());
      const response = await $api.post<LoginAnswerDataDTO>("/Auth/Login", loginData);
      AuthService.onLoginSuccess(dispatch, response.data.token);
    } catch (error) {
      dispatch(loginError());
    }
  }
  static async registrate(dispatch: AppDispatch, registrationData: RegistrationDataDTO): Promise<boolean> {
    try {
      dispatch(loginInit());
      const response = await $api.post<RegistrationAnswerDataDTO>("/Auth/Registrate", registrationData);
      AuthService.onLoginSuccess(dispatch, response.data.token);
      return true;
    } catch (error) {
      dispatch(loginError());
      return false;
    }
  }
  static logout(): void {
    localStorage.clear();
    window.location.reload();
  }
  private static onLoginByTokenSuccess(dispatch: AppDispatch): void {
    dispatch(loginByTokenSuccess());
    AuthService.loadAfterLogin(dispatch);
  }
  private static onLoginSuccess(dispatch: AppDispatch, token: string): void {
    dispatch(loginSuccess(token));
    AuthService.loadAfterLogin(dispatch);
  }
  private static loadAfterLogin(dispatch: AppDispatch) {
    ProfileService.loadProfile(dispatch);
  }
}