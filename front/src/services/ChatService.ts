import $api from "../http";
import { AppDispatch } from "../redux/store";
import { setCurrentDialog, setDialogs } from "../redux/slices/chatSlice";
import { uuid } from "../utils";
import UserModel from "../models/UserModel";
import MessageDTO from "../models/dtos/MessageDTO";
import DialogModel, { DialogTypes } from "../models/DialogModel";
import PrivateDialogDTO from "../models/dtos/PrivateDialogDTO";
import GroupDialogDTO from "../models/dtos/GroupDialogDTO";
import MessageModel from "../models/MessageModel";

export default class ChatService {
  static async searchGroupDialogsByNameContains(name: string): Promise<GroupDialogDTO[]> {
    try {
      const response = await $api.get<GroupDialogDTO[]>(`/Chat/SearchGroupDialogsByNameContains?name=${name}`);

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
      const response = await $api.get<{ privateDialogDTOs: PrivateDialogDTO[], groupDialogDTOs: GroupDialogDTO[] }>("/Chat/LoadDialogs");
      const { privateDialogDTOs, groupDialogDTOs } = response.data;

      const dialogs: DialogModel[] = [];
      privateDialogDTOs.forEach(d => {
        dialogs.push(ChatService.processPrivateDialogDTO(d));
      });
      groupDialogDTOs.forEach(d => {
        dialogs.push(ChatService.processGroupDialogDTO(d));
      });

      dispatch(setDialogs(dialogs));
    } catch (error) {
      console.log(error);
    }
  }

  static async sendMessage(dispatch: AppDispatch, dialog: DialogModel, message: MessageDTO): Promise<MessageModel | null> {
    try {
      if (dialog.type === DialogTypes.private) {
        return await ChatService.sendMessageToUser(dialog.id, message);
      }
      else if (dialog.type === DialogTypes.group) {
        return null;
        //return await ChatService.sendMessageToGroup(dialog.id, message);
      }
      else { return null; }
    } catch (error) {
      return null;
    }
  }

  static async sendMessageToUser(userId: number, message: MessageDTO) {
    const response = await $api.post<MessageModel>(`/Chat/SendMessageToUser?userId=${userId}`, message);
    return response.data;
  }
  static async sendMessageToGroup(groupId: number, message: MessageDTO) {

  }

  static findDialog(id: number, type: DialogTypes, dialogs: DialogModel[]): DialogModel | null {
    const dialog = dialogs.filter(d => d.id === id && d.type === type);

    if (dialog) { return dialog[0]; }
    else { return null; }
  }
  static async changeCurrentDialog(dispatch: AppDispatch, id: number, type: DialogTypes, dialogs: DialogModel[]) {
    dispatch(setCurrentDialog(undefined));

    const dialog = ChatService.findDialog(id, type, dialogs);
    if (!dialog) { return; }

    dispatch(setCurrentDialog(dialog));
  }

  static async getPrivateDialogFromApi(userId: number): Promise<PrivateDialogDTO | null> {
    try {
      const response = await $api.get<PrivateDialogDTO>(`/Chat/GetPrivateDialog?userId=${userId}`);
      return response.data;
    } catch (error) {
      return null;
    }
  }
  static async getGroupDialogFromApi(groupId: number): Promise<GroupDialogDTO | null> {
    try {
      const response = await $api.get<GroupDialogDTO>(`/Chat/GetGroupDialog?groupId=${groupId}`);
      return response.data;
    } catch (error) {
      return null;
    }
  }

  static processPrivateDialogDTO(dialog: PrivateDialogDTO): DialogModel {
    console.log(dialog);
    
    return {
      id: dialog.user.id,
      type: DialogTypes.private,
      name: dialog.user.login,
      messages: dialog.messages,
      users: [dialog.user],
      inputMessage: { id: uuid(), text: "", attachments: [] },
      avatarUrl: dialog.user.avatarUrl
    };
  }
  static processGroupDialogDTO(dialog: GroupDialogDTO): DialogModel {
    return {
      id: dialog.groupId,
      type: DialogTypes.group,
      name: dialog.name,
      messages: dialog.messages,
      users: dialog.users,
      inputMessage: { id: uuid(), text: "", attachments: [] },
      avatarUrl: dialog.groupAvatarUrl
    };
  }
}