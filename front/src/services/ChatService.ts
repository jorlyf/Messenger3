import $api from "../http";
import DialogModel from "../models/DialogModel";
import UserModel from "../models/UserModel";

export default class ChatService {
  static async searchDialogsByNameContains(name: string): Promise<DialogModel[]> {
    try {
      const response = await $api.get<DialogModel[]>(`/Chat/SearchDialogsByNameContains?name=${name}`);

      if (response.data) {
        return response.data;
      }
      return [];

    } catch (error) {
      console.log(error);
      return [];
    }
  }
  static async searchUsersByLoginContains(login: string): Promise<UserModel[]> {
    try {
      const response = await $api.get<UserModel[]>(`/Chat/SearchUsersByLoginContains?login=${login}`);

      if (response.data) {
        return response.data;
      }
      return [];

    } catch (error) {
      console.log(error);
      return [];
    }
  }
}