import $api from "../http";
import { AppDispatch } from "../redux/store";
import { addDialog, addDialogMessage, findCurrentDialog, setCurrentDialogInfo, setDialogs, setDialogsFetched } from "../redux/slices/chatSlice";
import { uuid } from "../utils";
import ProfileService from "./ProfileService";
import UserModel from "../entities/db/UserModel";
import DialogModel, { DialogTypes } from "../entities/db/DialogModel";
import PrivateDialogDTO from "../entities/dtos/PrivateDialogDTO";
import GroupDialogDTO from "../entities/dtos/GroupDialogDTO";
import Message, { MessageSendingStatus } from "../entities/local/Message";
import MessageDTO from "../entities/dtos/MessageDTO";
import SendMessageContainerDTO from "../entities/dtos/SendMessageContainerDTO";
import DialogsDTO from "../entities/dtos/DialogsDTO";
import GroupDialogCreatingDataDTO from "../entities/dtos/GroupDialogCreatingDataDTO";
import NewMessageDTO from "../entities/dtos/NewMessageDTO";

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
      dispatch(setDialogsFetched(true));
    } catch (error) {
      console.log(error);
    }
  }

  static async sendMessage(dialog: DialogModel, message: SendMessageContainerDTO): Promise<MessageDTO | null> {
    try {
      if (dialog.type === DialogTypes.private) {
        return await ChatService.sendMessageToUser(message);
      }
      else if (dialog.type === DialogTypes.group) {
        return await ChatService.sendMessageToGroup(message);
      }
      else { return null; }
    } catch (error) {
      return null;
    }
  }
  static async sendMessageToUser(message: SendMessageContainerDTO): Promise<MessageDTO | null> {
    const response = await $api.post<MessageDTO>("/Chat/SendMessageToUser", message);
    return response.data;
  }
  static async sendMessageToGroup(message: SendMessageContainerDTO): Promise<MessageDTO | null> {
    const response = await $api.post<MessageDTO>("/Chat/SendMessageToGroup", message);
    return response.data;
  }

  static async handleNewMessage(dispatch: AppDispatch, newMessageDTO: NewMessageDTO, allDialogs: DialogModel[]) {
    const message: Message = ChatService.processMessageDTO(newMessageDTO.messageDTO);

    if (newMessageDTO.dialogType === DialogTypes.private) {
      ChatService.handleNewPrivateMessage(dispatch, newMessageDTO.dialogId, message, allDialogs);
    }
    else {
      ChatService.handleNewGroupMessage(dispatch, newMessageDTO.dialogId, message, allDialogs);
    }
  }

  static async handleNewPrivateMessage(dispatch: AppDispatch, dialogId: number, message: Message, allDialogs: DialogModel[]) {
    let dialog: DialogModel | null = ChatService.findDialog(dialogId, DialogTypes.private, allDialogs);
    if (dialog) {
      dispatch(addDialogMessage({ dialogId: dialogId, dialogType: DialogTypes.private, message }));
    }
    else {
      const dialogDTO = await ChatService.getPrivateDialogFromApi(dialogId);
      if (dialogDTO) {
        dialog = ChatService.processPrivateDialogDTO(dialogDTO);
        dispatch(addDialog(dialog));
        return;
      }
      else {
        throw new Error("handle new private message from unknown dialog");
      }
    }

  }
  static async handleNewGroupMessage(dispatch: AppDispatch, dialogId: number, message: Message, allDialogs: DialogModel[]) {
    let dialog: DialogModel | null = ChatService.findDialog(dialogId, DialogTypes.group, allDialogs);
    if (!dialog) {
      const dialogDTO = await ChatService.getGroupDialogFromApi(dialogId);
      if (dialogDTO) {
        dialog = ChatService.processGroupDialogDTO(dialogDTO);
      }
      else {
        dialog = ChatService.createEmptyDialogModel(dialogId, DialogTypes.group);
      }
    }

    dispatch(addDialogMessage({ dialogId: dialogId, dialogType: DialogTypes.group, message }));
  }

  static findDialog(id: number, type: DialogTypes, dialogs: DialogModel[]): DialogModel | null {
    return findCurrentDialog(dialogs, { id: id, type: type, index: -1 });
  }
  static async changeCurrentDialog(dispatch: AppDispatch, id: number, type: DialogTypes, dialogs: DialogModel[], dialogsFetched: boolean) {
    dispatch(setCurrentDialogInfo(null));

    let dialog = ChatService.findDialog(id, type, dialogs);
    const index = -1;
    if (dialog) {
      dispatch(setCurrentDialogInfo({ id: id, type: type, index: index }));
      return;
    }

    if (!dialogsFetched) {
      return;
    }

    let dialogDTO: PrivateDialogDTO | GroupDialogDTO | null;
    switch (type) {
      case DialogTypes.private: {
        dialogDTO = await ChatService.getPrivateDialogFromApi(id);
        if (!dialogDTO) {
          dialog = await ChatService.createNewPrivateDialog(id);
          break;
        }
        dialog = ChatService.processPrivateDialogDTO(dialogDTO);
        break;
      }
      case DialogTypes.group: {
        dialogDTO = await ChatService.getGroupDialogFromApi(id);
        if (!dialogDTO) {
          dialog = ChatService.createEmptyDialogModel(id, type);
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
      avatarUrl: null,
      inputMessage: { id: uuid(), text: "", attachments: [] }
    }
  }

  static async createNewPrivateDialog(userId: number): Promise<DialogModel> {
    const user: UserModel | null = await ProfileService.getUser(userId);
    if (!user) {
      throw new Error("user not found");
    }

    return {
      id: userId,
      type: DialogTypes.private,
      userIds: [user.id],
      messages: [],
      name: user.login,
      avatarUrl: user.avatarUrl,
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

  static async createGroupDialog(ownerUserId: number, userIds: number[]): Promise<GroupDialogDTO | null> {
    const dto: GroupDialogCreatingDataDTO = {
      userCreatorId: ownerUserId,
      userIds: userIds
    }

    try {
      const response = await $api.post<GroupDialogDTO>("/Chat/CreateGroupDialog", dto);
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
    const att = dto.attachments.map(a => {
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