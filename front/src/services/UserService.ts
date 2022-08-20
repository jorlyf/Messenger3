import $api from "../http";
import UserModel from "../entities/db/UserModel";

export default class UserService {
  static async getUserById(userId: number): Promise<UserModel | null> {
    try {
      const response = await $api.get<UserModel>(`/User/GetUser?id=${userId}`);
      return response.data;
    } catch (error) {
      return null;
    }
  }
  static async searchUsersByLoginContains(login: string): Promise<UserModel[]> {
    try {
      const response = await $api.get<UserModel[]>(`/User/GetUsersByLoginContains?login=${login}`);
      return response.data;
    } catch (error) {
      console.log(error);
      return [];
    }
  }
}