import $api from "../http";
import { uuid } from "../utils";
import { AppDispatch } from "../redux/store";
import { addDialog, CurrentDialogInfo, setCurrentDialogInfo, setDialogs, setDialogsFetched } from "../redux/slices/chatSlice";
import MessageService from "./MessageService";
import UserService from "./UserService";
import DialogModel, { DialogTypes } from "../entities/db/DialogModel";
import DialogsDTO from "../entities/dtos/DialogsDTO";
import PrivateDialogDTO from "../entities/dtos/PrivateDialogDTO";
import GroupDialogDTO from "../entities/dtos/GroupDialogDTO";
import GroupDialogCreatingDataDTO from "../entities/dtos/GroupDialogCreatingDataDTO";
import UserModel from "../entities/db/UserModel";

export default class DialogService {
  static async loadDialogs(dispatch: AppDispatch) {
    try {
      const response = await $api.get<DialogsDTO>("/Dialog/GetDialogs");
      const { privateDialogDTOs, groupDialogDTOs } = response.data;

      const dialogs: DialogModel[] = [];
      privateDialogDTOs.forEach(d => {
        dialogs.push(DialogService.processPrivateDialogDTO(d));
      });
      groupDialogDTOs.forEach(d => {
        dialogs.push(DialogService.processGroupDialogDTO(d));
      });

      dispatch(setDialogs(dialogs));
      dispatch(setDialogsFetched(true));
    } catch (error) {
      console.log(error);
    }
  }

  static findDialog(dialogs: DialogModel[], id: number, type: DialogTypes): DialogModel | null {
    const dialog = dialogs.find(x => x.id === id && x.type === type);
    return dialog ? dialog : null;
  }

  static findCurrentDialog(dialogs: DialogModel[], current: CurrentDialogInfo): DialogModel | null {
    let dialog: DialogModel | null = DialogService.findCurrentDialogByIndex(dialogs, current);
    if (dialog) {
      return dialog;
    }
    dialog = DialogService.findDialog(dialogs, current.id, current.type);
    return dialog ? dialog : null;
  }

  static findCurrentDialogByIndex(dialogs: DialogModel[], current: CurrentDialogInfo): DialogModel | null {
    if (current.index < 0) return null;
    if (current.index >= dialogs.length) throw new Error("invalid index of current dialog");

    const dialog = dialogs.at(current.index);
    if (!dialog) return null;
    if (dialog.id !== current.id || dialog.type !== current.type) return null;
    return dialog;
  }

  static async changeCurrentDialog(dispatch: AppDispatch, id: number, type: DialogTypes, dialogs: DialogModel[], dialogsFetched: boolean) {
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
  static createEmptyDialogModel(id: number, type: DialogTypes): DialogModel {
    return {
      id: id,
      type: type,
      userIds: [],
      messages: [],
      name: "",
      avatarUrl: null,
      inputMessage: { id: uuid(), text: "", attachments: [] },
      lastUpdateTotalMilliseconds: Number(Date.now())
    }
  }

  static async createPrivateDialog(userId: number): Promise<DialogModel> {
    const user: UserModel | null = await UserService.getUserById(userId);
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
      inputMessage: { id: uuid(), text: "", attachments: [] },
      lastUpdateTotalMilliseconds: Number(Date.now())
    }
  }
  static async createGroupDialog(ownerUserId: number, userIds: number[]): Promise<DialogModel | null> {
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

  static processPrivateDialogDTO(dialog: PrivateDialogDTO): DialogModel {
    const messages = MessageService.processMessageDTOs(dialog.messages);
    return {
      id: dialog.userId,
      type: DialogTypes.private,
      name: dialog.name,
      messages: messages,
      userIds: [dialog.userId],
      inputMessage: { id: uuid(), text: "", attachments: [] },
      avatarUrl: dialog.userAvatarUrl,
      lastUpdateTotalMilliseconds: dialog.lastUpdateTotalMilliseconds
    };
  }
  static processGroupDialogDTO(dialog: GroupDialogDTO): DialogModel {
    const messages = MessageService.processMessageDTOs(dialog.messages);
    return {
      id: dialog.groupId,
      type: DialogTypes.group,
      name: dialog.name,
      messages: messages,
      userIds: dialog.userIds,
      inputMessage: { id: uuid(), text: "", attachments: [] },
      avatarUrl: dialog.groupAvatarUrl,
      lastUpdateTotalMilliseconds: dialog.lastUpdateTotalMilliseconds
    };
  }
}