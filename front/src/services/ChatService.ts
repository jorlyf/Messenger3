import $api from "../http";
import DialogModel from "../models/DialogModel";
import UserModel from "../models/UserModel";

export default class ChatService {
  static async searchDialogsByNameContains(name: string): Promise<UserModel[]> {
    try {
      console.log(name);
      
      const response = await $api.get<UserModel[]>(`/Chat/SearchDialogsByNameContains?name=${name}`);
      
      if (response.data)
      {
        return response.data;
      }
      return [];

    } catch (error) {
      console.log(error);
      return [];
    }
  }
  static async searchUsersByLoginContains(login: string): Promise<DialogModel[]> {
    try {
      const response = await $api.get<DialogModel[]>(`/Chat/SearchUsersByLoginContains?login=${login}`);
      
      if (response.data)
      {
        return response.data;
      }
      return [];   

    } catch (error) {
      console.log(error);
      return [];
    }
  }
}