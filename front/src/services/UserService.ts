import $api from "../http";
import UserModel from "../entities/db/UserModel";
import GroupDialogDTO from "../entities/dtos/GroupDialogDTO";

export default class UserService {
  static async getUserById(userId: number): Promise<UserModel | null> {
    try {
      const response = await $api.get<UserModel>(`/Profile/GetUser?id=${userId}`);
      return response.data;
    } catch (error) {
      return null;
    }
  }

  static async searchGroupDialogsByNameContains(name: string): Promise<GroupDialogDTO[]> {
    try {
      const response = await $api.get<GroupDialogDTO[]>(`/Chat/SearchGroupDialogsByNameContains?name=${name}`);
      return response.data;
    } catch (error) {
      console.log(error);
      return [];
    }
  }
  static async searchUsersByLoginContains(login: string): Promise<UserModel[]> {
    try {
      const response = await $api.get<UserModel[]>(`/Chat/GetUsersByLoginContains?login=${login}`);
      return response.data;
    } catch (error) {
      console.log(error);
      return [];
    }
  }
}