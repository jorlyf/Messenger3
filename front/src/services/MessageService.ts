import $api from "../http";
import { uuid } from "../utils";
import { AppDispatch } from "../redux/store";
import { addCurrentDialogMessage, addDialog, addDialogMessage, replaceDialogTempMessage, setMessageSendingStatus, updateDialogTotalMilliseconds } from "../redux/slices/chatSlice";
import DialogService from "./DialogService";
import Message, { MessageSendingStatus } from "../entities/local/Message";
import Dialog, { DialogTypes } from "../entities/local/Dialog";
import MessageDTO from "../entities/dtos/chat/MessageDTO";
import NewMessageDTO from "../entities/dtos/chat/NewMessageDTO";
import SendMessageContainerDTO from "../entities/dtos/chat/SendMessageContainerDTO";
import MessageInput from "../entities/local/MessageInput";
import Attachment from "../entities/local/Attachment";

export default class MessageService {
  static async getOldestMessages(dialogs: Dialog[], dialogId: number, dialogType: DialogTypes): Promise<Message[]> {
    try {
      const dialog = DialogService.findDialog(dialogs, dialogId, dialogType);
      if (!dialog) return [];
      if (dialog.totalMessagesCount <= dialog.messages.length) {
        return []; // all messages getted
      }
      const apiMessages = dialog.messages.filter(x => x.apiId);
      if (apiMessages.length === 0) return [];
      const oldestMessageId = apiMessages.reduce((x, y) => (x.apiId! < y.apiId!) ? x : y).apiId;

      if (!oldestMessageId) return [];
      const params = {
        dialogId,
        dialogType,
        oldestMessageId
      }
      const response = await $api.get<MessageDTO[]>("/Message/GetMoreDialogMessages", { params });
      const newMessages = MessageService.processMessageDTOs(response.data);
      if (newMessages.length === 0) {
        console.log("сообщений больше нет");
      }
      return newMessages;
    } catch (error) {
      console.log(error);
      return [];
    }
  }

  static createMessageInput(dialogId: number, dialogType: DialogTypes): MessageInput {
    return {
      dialogId,
      dialogType,
      text: "",
      attachments: []
    }
  }
  static findMessageInput(messageInputs: MessageInput[], dialogId: number, dialogType: DialogTypes): MessageInput | null {
    const messageInput = messageInputs.find(x => x.dialogId === dialogId && x.dialogType === dialogType);
    return messageInput ? messageInput : null;
  }
  static getMessageInput(messageInputs: MessageInput[], dialogId: number, dialogType: DialogTypes): MessageInput {
    let messageInput = MessageService.findMessageInput(
      messageInputs,
      dialogId,
      dialogType
    );
    if (!messageInput) {
      messageInput = MessageService.createMessageInput(dialogId, dialogType);
      messageInputs.push(messageInput);
    }
    return messageInput;
  }

  static async sendMessage(dispatch: AppDispatch, dialog: Dialog, messageDTO: SendMessageContainerDTO): Promise<Message | null> {
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
  static async sendMessageToUser(sendMessageContainerDTO: SendMessageContainerDTO): Promise<Message | null> {
    const response = await $api.post<MessageDTO>("/Message/SendMessageToUser", sendMessageContainerDTO);
    return MessageService.processMessageDTO(response.data);
  }
  static async sendMessageToGroup(sendMessageContainerDTO: SendMessageContainerDTO): Promise<Message | null> {
    const response = await $api.post<MessageDTO>("/Message/SendMessageToGroup", sendMessageContainerDTO);
    return MessageService.processMessageDTO(response.data);
  }

  static async handleNewMessage(dispatch: AppDispatch, newMessageDTO: NewMessageDTO, allDialogs: Dialog[]) {
    const message: Message = MessageService.processMessageDTO(newMessageDTO.messageDTO);

    if (newMessageDTO.dialogType === DialogTypes.private) {
      MessageService.handleNewPrivateMessage(dispatch, newMessageDTO.dialogId, message, allDialogs);
    }
    else {
      MessageService.handleNewGroupMessage(dispatch, newMessageDTO.dialogId, message, allDialogs);
    }
  }

  static async handleNewPrivateMessage(dispatch: AppDispatch, dialogId: number, message: Message, allDialogs: Dialog[]) {
    let dialog = DialogService.findDialog(allDialogs, dialogId, DialogTypes.private);
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
  static async handleNewGroupMessage(dispatch: AppDispatch, dialogId: number, message: Message, allDialogs: Dialog[]) {
    let dialog = DialogService.findDialog(allDialogs, dialogId, DialogTypes.group);
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
    const atts: Attachment[] = dto.attachmentDTOs.map(a => {
      return { id: uuid(), apiId: a.id, type: a.type, url: a.url }
    });
    return {
      id: uuid(),
      apiId: dto.id,
      text: dto.text,
      attachments: atts,
      senderUser: dto.senderUser,
      status: MessageSendingStatus.ok,
      sentAtTotalMilliseconds: dto.sentAtTotalMilliseconds
    }
  }
}