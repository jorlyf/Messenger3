import $api from "../http";
import { AppDispatch } from "../redux/store";
import { loginByTokenSuccess, loginError, loginInit, loginSuccess } from "../redux/slices/authSlice";
import LoginDataDTO from "../models/dtos/LoginDataDTO";
import RegistrationDataDTO from "../models/dtos/RegistrationDataDTO";
import ProfileService from "./ProfileService";

export default class AuthService {
  static async loginByToken(dispatch: AppDispatch): Promise<void> {
    try {
      dispatch(loginInit());
      const response = await $api.post<null>("/Auth/LoginByToken");
      AuthService.onLoginByTokenSuccess(dispatch);
    } catch (error) {
      dispatch(loginError());
      console.log(error);
    }
  }
  static async login(dispatch: AppDispatch, loginData: LoginDataDTO): Promise<void> {
    try {
      dispatch(loginInit());
      const response = await $api.post<string>("/Auth/Login", loginData);
      AuthService.onLoginSuccess(dispatch, response.data);
    } catch (error) {
      dispatch(loginError());
      console.log(error);
    }
  }
  static async registrate(registrationData: RegistrationDataDTO): Promise<void> {



  }
  static logout(): void {
    localStorage.clear();
    window.location.reload();
  }
  private static onLoginByTokenSuccess(dispatch: AppDispatch): void {
    dispatch(loginByTokenSuccess());
    AuthService.loadProfileAfterLogin(dispatch);
  }
  private static onLoginSuccess(dispatch: AppDispatch, token: string): void {
    dispatch(loginSuccess(token));
    AuthService.loadProfileAfterLogin(dispatch);
  }
  private static loadProfileAfterLogin(dispatch: AppDispatch) {
    ProfileService.LoadProfile(dispatch);
  }
}