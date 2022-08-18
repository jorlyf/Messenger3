import * as React from "react";
import { useDispatch } from "react-redux";
import { uuid } from "../../utils";
import useAppSelector from "../../hooks/useAppSelector";
import { clearCurrentDialogInputMessage } from "../../redux/slices/chatSlice";
import DialogService from "../../services/DialogService";
import MessageService from "../../services/MessageService";
import DialogModel, { DialogTypes } from "../../entities/db/DialogModel";
import Message, { MessageSendingStatus } from "../../entities/local/Message";
import SendMessageContainerDTO from "../../entities/dtos/SendMessageContainerDTO";
import MessageDTO from "../../entities/dtos/MessageDTO";

const useChat = (chatId?: string) => {
  const dispatch = useDispatch();

  const [currentDialog, setCurrentDialog] = React.useState<DialogModel | null>(null);

  const allDialogs = useAppSelector(state => state.chat.dialogs);
  const dialogsFetched = useAppSelector(state => state.chat.dialogsFetched);
  const currentDialogInfo = useAppSelector(state => state.chat.currentDialogInfo);
  const ownerUser = useAppSelector(state => state.profile.user);
  const inputMessages = useAppSelector(state => state.chat.inputMessages);

  const handleSendMessage = async () => {
    if (!currentDialog || !currentDialogInfo) return;
    if (!ownerUser) return;

    const inputMessage = MessageService.findInputMessage(inputMessages, currentDialogInfo.id, currentDialogInfo?.type);
    if (!inputMessage) return;
    
    if (!inputMessage.text && inputMessage.attachments.length === 0) return;
    if (inputMessage.text.length > 4096) return;

    const tempMessage: Message = { // to display, will replaced by message from api
      id: uuid(),
      text: inputMessage.text,
      senderUser: ownerUser,
      attachments: [],
      status: MessageSendingStatus.isSending,
      timeMilliseconds: new Date().getTime()
    }
    MessageService.addSendingMessage(dispatch, tempMessage);
    dispatch(clearCurrentDialogInputMessage());

    const sendMessageDTO: SendMessageContainerDTO = {
      toId: currentDialogInfo.id,
      type: currentDialogInfo.type,
      message: {
        text: inputMessage.text,
        attachments: inputMessage.attachments
      }
    }
    const apiMessage: Message | null = await MessageService.sendMessage(dispatch, currentDialog, sendMessageDTO);
    if (!apiMessage) {
      MessageService.changeStatusSendingMessage(dispatch, currentDialogInfo.id, currentDialogInfo.type, tempMessage.id, MessageSendingStatus.error);
      return;
    }

    MessageService.replaceSendingMessageByUuid(dispatch, currentDialog.id, currentDialog.type, apiMessage, tempMessage.id);
  }

  const handleChangeCurrentDialog = (chatId: string) => {
    if (!chatId || chatId.split.length != 2) { return; }
    const stringType: string = chatId.split("=")[0];
    const id: number = Number(chatId.split("=")[1]);
    let type: DialogTypes;

    switch (stringType) {
      case "user": {
        type = DialogTypes.private;
        break;
      }
      case "group": {
        type = DialogTypes.group;
        break;
      }
      default: {
        return;
      }
    }

    DialogService.changeCurrentDialog(dispatch, id, type, allDialogs, dialogsFetched);
  }

  React.useEffect(() => {
    if (!chatId) return;
    if (!dialogsFetched) return;

    handleChangeCurrentDialog(chatId);
  }, [chatId, dialogsFetched]);

  React.useEffect(() => {
    if (!currentDialogInfo) return;

    const dialog = DialogService.findCurrentDialog(allDialogs, currentDialogInfo);
    setCurrentDialog(dialog);
  }, [allDialogs, currentDialogInfo]);

  return { currentDialog, handleSendMessage };
}

export default useChat;