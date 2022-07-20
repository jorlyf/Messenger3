import $api from "../http";
import { AppDispatch } from "../redux/store";
import DialogModel from "../models/DialogModel";
import UserModel from "../models/UserModel";
import MessageDTO from "../models/dtos/MessageDTO";

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
  static async loadDialogs(dispatch: AppDispatch) {
    try {
      const response = await $api.get<DialogModel[]>("/Chat/LoadDialogs");
      console.log(response);

    } catch (error) {
      console.log(error);
    }
  }

  static async sendMessageToUser(dispatch: AppDispatch, message: MessageDTO) {
    try {
      const response = await $api.post("/Chat/SendMessageToUser", message);
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  }
}