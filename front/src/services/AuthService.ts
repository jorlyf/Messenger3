import path from "path";
import fs from "fs";
import LoginDataDTO from "../models/dtos/LoginDataDTO";
import RegistrationDataDTO from "../models/dtos/RegistrationDataDTO";

interface Validations {
  login: {
    maxLength: number;
    minLength: number;
  },
  username: {
    maxLength: number;
    minLength: number;
  },
  password: {
    maxLength: number;
    minLength: number;
  }
}

class Validator {
  private static path: string = path.resolve("..", "..", "..", "messangerConfig.json");
  private static validations: Validations;
  constructor() {
    try {
      fs.readFile(Validator.path, { encoding: "utf-8" }, (err, data) => {
        if (err) { throw err; }

        Validator.validations = JSON.parse(data).validations;
      });
    } catch (error) {
      console.log(error);
    }
  }

  validateLoginData(data: LoginDataDTO): boolean {
    this.validateLogin(data.login);
    this.validatePassword(data.password);

    return true;
  }
  validateRegisrationData(data: RegistrationDataDTO): boolean {
    this.validateLogin(data.login);
    this.validateUsername(data.username);
    this.validatePassword(data.password);

    return true;
  }
  validateLogin(login: string): boolean {
    return login.length >= Validator.validations.login.minLength && login.length <= Validator.validations.login.maxLength;
  }
  validateUsername(username: string): boolean {
    return username.length >= Validator.validations.username.minLength && username.length <= Validator.validations.username.maxLength;
  }
  validatePassword(password: string): boolean {
    return password.length >= Validator.validations.password.minLength && password.length <= Validator.validations.password.maxLength;
  }
}

export default class AuthService {
  static validator: Validator = new Validator();

  static async loginByToken(token: string) {
    
  }
  static async login(loginData: LoginDataDTO) {
    if (AuthService.validator.validateLoginData(loginData)) return;


  }
  static async registrate(registrationData: RegistrationDataDTO) {
    if (AuthService.validator.validateRegisrationData(registrationData)) return;


  }
  static logout() {
    localStorage.clear();
    window.location.reload();
  }
}