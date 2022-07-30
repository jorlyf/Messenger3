import $api from "../http";
import { AppDispatch } from "../redux/store";
import { addDialog, findCurrentDialog, setCurrentDialogInfo, setDialogs } from "../redux/slices/chatSlice";
import { uuid } from "../utils";
import UserModel from "../entities/db/UserModel";
import DialogModel, { DialogTypes } from "../entities/db/DialogModel";
import PrivateDialogDTO from "../entities/dtos/PrivateDialogDTO";
import GroupDialogDTO from "../entities/dtos/GroupDialogDTO";
import Message, { MessageSendingStatus } from "../entities/local/Message";
import MessageDTO from "../entities/dtos/MessageDTO";
import SendMessageContainerDTO from "../entities/dtos/SendMessageContainerDTO";
import DialogsDTO from "../entities/dtos/DialogsDTO";

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
      const response = await $api.get<UserModel[]>(`/Chat/GetUsersByLoginContains?login=${login}`);

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
      const response = await $api.get<DialogsDTO>("/Chat/GetDialogs");
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

  static async sendMessage(dialog: DialogModel, message: SendMessageContainerDTO): Promise<MessageDTO | null> {
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

  static async sendMessageToUser(userId: number, message: SendMessageContainerDTO): Promise<MessageDTO | null> {
    const response = await $api.post<MessageDTO>("/Chat/SendMessageToUser", message);
    return response.data;
  }
  // static async sendMessageToGroup(groupId: number, message: SendMessageContainerDTO): Promise<MessageDTO | null> {

  // }

  static findDialog(id: number, type: DialogTypes, dialogs: DialogModel[]): DialogModel | null {
    const dialog = findCurrentDialog(dialogs, { id: id, type: type, index: -1 });
    return dialog ? dialog : null;
  }
  static async changeCurrentDialog(dispatch: AppDispatch, id: number, type: DialogTypes, dialogs: DialogModel[]) {
    dispatch(setCurrentDialogInfo(null));

    let dialog = ChatService.findDialog(id, type, dialogs);
    const index = dialogs.length;
    if (dialog) { 
      dispatch(setCurrentDialogInfo({ id: id, type: type, index: index }));
      return;
    }
    let dialogDTO: PrivateDialogDTO | GroupDialogDTO | null;
    switch (type) {
      case DialogTypes.private: {
        dialogDTO = await this.getPrivateDialogFromApi(id);
        if (!dialogDTO) {
          dialog = this.createEmptyDialogModel(id, type);
          break;
        }
        dialog = ChatService.processPrivateDialogDTO(dialogDTO);
        break;
      }
      case DialogTypes.group: {
        dialogDTO = await this.getGroupDialogFromApi(id);
        if (!dialogDTO) {
          dialog = this.createEmptyDialogModel(id, type);
          break;
        }
        dialog = ChatService.processGroupDialogDTO(dialogDTO);
        break;
      }
      default: { return; }
    }

    dispatch(addDialog(dialog));
    dispatch(setCurrentDialogInfo({ id: id, type: type, index: index }));
  }
  static createEmptyDialogModel(id: number, type: DialogTypes): DialogModel {
    return {
      id: id,
      type: type,
      userIds: [],
      messages: [],
      name: "",
      inputMessage: { id: uuid(), text: "", attachments: [] }
    }
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

  static processMessageDTOs(dtos: MessageDTO[]): Message[] {
    return dtos.map(dto => {
      return this.processMessageDTO(dto);
    });
  }

  static processMessageDTO(dto: MessageDTO): Message {
    const att = dto.attachments?.map(a => {
      return { id: uuid(), type: a.type, url: a.url }
    });
    return {
      id: uuid(),
      text: dto.text,
      attachments: att,
      senderUser: dto.senderUser,
      status: MessageSendingStatus.ok,
      timeMilliseconds: dto.sentAtTotalMilliseconds
    }
  }

  static processPrivateDialogDTO(dialog: PrivateDialogDTO): DialogModel {
    const messages = ChatService.processMessageDTOs(dialog.messages);
    return {
      id: dialog.userId,
      type: DialogTypes.private,
      name: dialog.name,
      messages: messages,
      userIds: [dialog.userId],
      inputMessage: { id: uuid(), text: "", attachments: [] },
      avatarUrl: dialog.userAvatarUrl
    };
  }
  static processGroupDialogDTO(dialog: GroupDialogDTO): DialogModel {
    const messages = ChatService.processMessageDTOs(dialog.messages);
    return {
      id: dialog.groupId,
      type: DialogTypes.group,
      name: dialog.name,
      messages: messages,
      userIds: dialog.userIds,
      inputMessage: { id: uuid(), text: "", attachments: [] },
      avatarUrl: dialog.groupAvatarUrl
    };
  }
}