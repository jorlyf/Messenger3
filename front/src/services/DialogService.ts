import $api from "../http";
import { AppDispatch } from "../redux/store";
import { addDialog, addDialogs, CurrentDialogInfo, setCurrentDialogInfo, setDialogsFetched, setTotalDialogCount } from "../redux/slices/chatSlice";
import MessageService from "./MessageService";
import UserService from "./UserService";
import Dialog, { DialogTypes } from "../entities/local/Dialog";
import PrivateDialogDTO from "../entities/dtos/chat/PrivateDialogDTO";
import GroupDialogDTO from "../entities/dtos/chat/GroupDialogDTO";
import GroupDialogCreatingDataDTO from "../entities/dtos/chat/GroupDialogCreatingDataDTO";
import UserModel from "../entities/db/UserModel";
import { MoreDialogsAnswer, MoreDialogsRequest } from "../entities/dtos/MoreDialogs";

export default class DialogService {
  static async fisrtLoadDialogs(dispatch: AppDispatch) {
    try {
      await DialogService.getMoreDialogs(dispatch, [], null);
      dispatch(setDialogsFetched(true));
    } catch (error) { }
  }

  static async getMoreDialogs(dispatch: AppDispatch, existingDialogs: Dialog[], totalDialogCount: number | null) {
    if (totalDialogCount && existingDialogs.length >= totalDialogCount) return;

    const moreDialogsRequest: MoreDialogsRequest = {
      existingDialogs: existingDialogs.map(x => {
        return {
          id: x.id,
          type: x.type
        }
      })
    }

    try {
      const response = await $api.post<MoreDialogsAnswer>("/Dialog/GetMoreDialogs", moreDialogsRequest);
      const { privateDialogDTOs, groupDialogDTOs } = response.data.dialogsDTO;

      const dialogs: Dialog[] = [];
      privateDialogDTOs.forEach(d => {
        dialogs.push(DialogService.processPrivateDialogDTO(d));
      });
      groupDialogDTOs.forEach(d => {
        dialogs.push(DialogService.processGroupDialogDTO(d));
      });
      dispatch(addDialogs(dialogs));
      if (!totalDialogCount) { dispatch(setTotalDialogCount(response.data.totalDialogCount)); }
    } catch (error) {
      console.log("Неудачная попытка загрузить диалоги");
    }
  }

  static findDialog(dialogs: Dialog[], id: number, type: DialogTypes): Dialog | null {
    const dialog = dialogs.find(x => x.id === id && x.type === type);
    return dialog ? dialog : null;
  }

  static findCurrentDialog(dialogs: Dialog[], current: CurrentDialogInfo): Dialog | null {
    let dialog: Dialog | null = DialogService.findCurrentDialogByIndex(dialogs, current);
    if (dialog) {
      return dialog;
    }
    dialog = DialogService.findDialog(dialogs, current.id, current.type);
    return dialog ? dialog : null;
  }

  static findCurrentDialogByIndex(dialogs: Dialog[], current: CurrentDialogInfo): Dialog | null {
    if (current.index < 0) return null;
    if (current.index >= dialogs.length) throw new Error("invalid index of current dialog");

    const dialog = dialogs.at(current.index);
    if (!dialog) return null;
    if (dialog.id !== current.id || dialog.type !== current.type) return null;
    return dialog;
  }

  static async changeCurrentDialog(dispatch: AppDispatch, id: number, type: DialogTypes, dialogs: Dialog[], dialogsFetched: boolean) {
    dispatch(setCurrentDialogInfo(null));

    let dialog = DialogService.findDialog(dialogs, id, type);
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
        dialogDTO = await DialogService.getPrivateDialogFromApi(id);
        if (!dialogDTO) {
          dialog = await DialogService.createPrivateDialog(id);
          break;
        }
        dialog = DialogService.processPrivateDialogDTO(dialogDTO);
        break;
      }
      case DialogTypes.group: {
        dialogDTO = await DialogService.getGroupDialogFromApi(id);
        if (!dialogDTO) {
          dialog = DialogService.createEmptyDialogModel(id, type);
          break;
        }
        dialog = DialogService.processGroupDialogDTO(dialogDTO);
        break;
      }
      default: { return; }
    }

    dispatch(addDialog(dialog));
    dispatch(setCurrentDialogInfo({ id: id, type: type, index: index }));
  }
  static createEmptyDialogModel(id: number, type: DialogTypes): Dialog {
    return {
      id: id,
      type: type,
      userIds: [],
      messages: [],
      totalMessagesCount: 0,
      name: "",
      avatarUrl: null,
      lastUpdateTotalMilliseconds: new Date().getTime()
    }
  }

  static async createPrivateDialog(userId: number): Promise<Dialog> {
    const user: UserModel | null = await UserService.getUserById(userId);
    if (!user) {
      throw new Error("user not found");
    }

    return {
      id: userId,
      type: DialogTypes.private,
      userIds: [user.id],
      messages: [],
      totalMessagesCount: 0,
      name: user.login,
      avatarUrl: user.avatarUrl,
      lastUpdateTotalMilliseconds: new Date().getTime()
    }
  }
  static async createGroupDialog(ownerUserId: number, userIds: number[]): Promise<Dialog | null> {
    const dto: GroupDialogCreatingDataDTO = {
      userCreatorId: ownerUserId,
      userIds: userIds
    }

    try {
      const response = await $api.post<GroupDialogDTO>("/Dialog/CreateGroupDialog", dto);
      return DialogService.processGroupDialogDTO(response.data);
    } catch (error) {
      return null;
    }
  }

  static async getPrivateDialogFromApi(userId: number): Promise<PrivateDialogDTO | null> {
    try {
      const response = await $api.get<PrivateDialogDTO>(`/Dialog/GetPrivateDialog?userId=${userId}`);
      return response.data;
    } catch (error) {
      return null;
    }
  }
  static async getGroupDialogFromApi(groupId: number): Promise<GroupDialogDTO | null> {
    try {
      const response = await $api.get<GroupDialogDTO>(`/Dialog/GetGroupDialog?groupId=${groupId}`);
      return response.data;
    } catch (error) {
      return null;
    }
  }

  static async searchGroupDialogsByNameContains(name: string): Promise<GroupDialogDTO[]> {
    try {
      const response = await $api.get<GroupDialogDTO[]>(`/Dialog/SearchGroupDialogsByNameContains?name=${name}`);
      return response.data;
    } catch (error) {
      console.log(error);
      return [];
    }
  }

  static processPrivateDialogDTO(dialog: PrivateDialogDTO): Dialog {
    const messages = MessageService.processMessageDTOs(dialog.messages);
    return {
      id: dialog.userId,
      type: DialogTypes.private,
      name: dialog.name,
      messages: messages,
      totalMessagesCount: dialog.totalMessagesCount,
      userIds: [dialog.userId],
      avatarUrl: dialog.userAvatarUrl,
      lastUpdateTotalMilliseconds: dialog.lastUpdateTotalMilliseconds
    };
  }
  static processGroupDialogDTO(dialog: GroupDialogDTO): Dialog {
    const messages = MessageService.processMessageDTOs(dialog.messages);
    return {
      id: dialog.groupId,
      type: DialogTypes.group,
      name: dialog.name,
      messages: messages,
      totalMessagesCount: dialog.totalMessagesCount,
      userIds: dialog.userIds,
      avatarUrl: dialog.groupAvatarUrl,
      lastUpdateTotalMilliseconds: dialog.lastUpdateTotalMilliseconds
    };
  }
}