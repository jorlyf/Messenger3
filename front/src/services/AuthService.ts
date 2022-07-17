import $api from "../http";
import LoginDataDTO from "../models/dtos/LoginDataDTO";
import RegistrationDataDTO from "../models/dtos/RegistrationDataDTO";

export default class AuthService {
  static async loginByToken() {
    try {
      const response = await $api.post("/Auth/LoginByToken");
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  }
  static async login(loginData: LoginDataDTO) {



  }
  static async registrate(registrationData: RegistrationDataDTO) {



  }
  static logout() {
    localStorage.clear();
    window.location.reload();
  }
}