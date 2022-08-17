import $api from "../http";
import { uuid } from "../utils";
import { AppDispatch } from "../redux/store";
import { addCurrentDialogMessage, addDialog, addDialogMessage, replaceDialogTempMessage, setMessageSendingStatus, updateDialogTotalMilliseconds } from "../redux/slices/chatSlice";
import DialogService from "./DialogService";
import Message, { MessageSendingStatus } from "../entities/local/Message";
import DialogModel, { DialogTypes } from "../entities/db/DialogModel";
import MessageDTO from "../entities/dtos/MessageDTO";
import NewMessageDTO from "../entities/dtos/NewMessageDTO";
import SendMessageContainerDTO from "../entities/dtos/SendMessageContainerDTO";

export default class MessageService {
  static async sendMessage(dispatch: AppDispatch, dialog: DialogModel, messageDTO: SendMessageContainerDTO): Promise<Message | null> {
    try {
      if (dialog.type === DialogTypes.private) {
        const message: Message | null = await MessageService.sendMessageToUser(messageDTO);
        dispatch(updateDialogTotalMilliseconds({ dialogId: dialog.id, dialogType: dialog.type, value: new Date().getTime() }));
        return message;
      }
      else {
        const message: Message | null = await MessageService.sendMessageToGroup(messageDTO);
        dispatch(updateDialogTotalMilliseconds({ dialogId: dialog.id, dialogType: dialog.type, value: new Date().getTime() }));
        return message;
      }
    } catch (error) {
      return null;
    }
  }
  static async sendMessageToUser(sendMessageDTO: SendMessageContainerDTO): Promise<Message | null> {
    const response = await $api.post<MessageDTO>("/Message/SendMessageToUser", sendMessageDTO);
    return MessageService.processMessageDTO(response.data);
  }
  static async sendMessageToGroup(message: SendMessageContainerDTO): Promise<Message | null> {
    const response = await $api.post<MessageDTO>("/Message/SendMessageToGroup", message);
    return MessageService.processMessageDTO(response.data);
  }

  static async handleNewMessage(dispatch: AppDispatch, newMessageDTO: NewMessageDTO, allDialogs: DialogModel[]) {
    const message: Message = MessageService.processMessageDTO(newMessageDTO.messageDTO);

    if (newMessageDTO.dialogType === DialogTypes.private) {
      MessageService.handleNewPrivateMessage(dispatch, newMessageDTO.dialogId, message, allDialogs);
    }
    else {
      MessageService.handleNewGroupMessage(dispatch, newMessageDTO.dialogId, message, allDialogs);
    }
  }

  static async handleNewPrivateMessage(dispatch: AppDispatch, dialogId: number, message: Message, allDialogs: DialogModel[]) {
    let dialog: DialogModel | null = DialogService.findDialog(allDialogs, dialogId, DialogTypes.private);
    if (dialog) {
      dispatch(addDialogMessage({ dialogId: dialogId, dialogType: DialogTypes.private, message }));
    }
    else {
      const dialogDTO = await DialogService.getPrivateDialogFromApi(dialogId);
      if (dialogDTO) {
        dialog = DialogService.processPrivateDialogDTO(dialogDTO);
        dispatch(addDialog(dialog));
        return;
      }
      else {
        throw new Error("handle new private message from unknown dialog");
      }
    }

  }
  static async handleNewGroupMessage(dispatch: AppDispatch, dialogId: number, message: Message, allDialogs: DialogModel[]) {
    let dialog: DialogModel | null = DialogService.findDialog(allDialogs, dialogId, DialogTypes.group);
    if (!dialog) {
      const dialogDTO = await DialogService.getGroupDialogFromApi(dialogId);
      if (dialogDTO) {
        dialog = DialogService.processGroupDialogDTO(dialogDTO);
      }
      else {
        dialog = DialogService.createEmptyDialogModel(dialogId, DialogTypes.group);
      }
    }

    dispatch(addDialogMessage({ dialogId: dialogId, dialogType: DialogTypes.group, message }));
  }

  static addSendingMessage(dispatch: AppDispatch, message: Message) {
    dispatch(addCurrentDialogMessage(message));
  }
  static replaceSendingMessageByUuid(dispatch: AppDispatch, dialogId: number, dialogType: DialogTypes, toReplaceMessage: Message, oldMessageUuid: string) {
    dispatch(replaceDialogTempMessage({
      dialogId: dialogId,
      dialogType: dialogType,
      message: toReplaceMessage,
      uuid: oldMessageUuid
    }));
  }
  static changeStatusSendingMessage(dispatch: AppDispatch, dialogId: number, dialogType: DialogTypes, uuid: string, newStatus: MessageSendingStatus) {
    dispatch(setMessageSendingStatus({
      dialogId: dialogId,
      dialogType: dialogType,
      uuid: uuid,
      status: newStatus
    }));
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
}