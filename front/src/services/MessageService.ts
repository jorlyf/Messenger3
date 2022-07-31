import { AppDispatch } from "../redux/store";
import { addCurrentDialogMessage, replaceDialogTempMessage, setMessageSendingStatus } from "../redux/slices/chatSlice";
import Message, { MessageSendingStatus } from "../entities/local/Message";
import { DialogTypes } from "../entities/db/DialogModel";

export default class MessageService {
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
}