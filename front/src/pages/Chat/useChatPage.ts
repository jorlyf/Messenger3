import * as React from "react";
import { useDispatch } from "react-redux";
import { uuid } from "../../utils";
import useAppSelector from "../../hooks/useAppSelector";
import { clearCurrentDialogMessageInput } from "../../redux/slices/chatSlice";
import DialogService from "../../services/DialogService";
import MessageService from "../../services/MessageService";
import DialogModel, { DialogTypes } from "../../entities/local/Dialog";
import Message, { MessageSendingStatus } from "../../entities/local/Message";
import SendMessageContainerDTO from "../../entities/dtos/chat/SendMessageContainerDTO";

const useChat = (chatId?: string) => {
  const dispatch = useDispatch();

  const [currentDialog, setCurrentDialog] = React.useState<DialogModel | null>(null);

  const allDialogs = useAppSelector(state => state.chat.dialogs);
  const dialogsFetched = useAppSelector(state => state.chat.dialogsFetched);
  const currentDialogInfo = useAppSelector(state => state.chat.currentDialogInfo);
  const ownerUser = useAppSelector(state => state.profile.user);
  const messageInputs = useAppSelector(state => state.chat.messageInputs);

  const handleSendMessage = async () => {
    if (!currentDialog || !currentDialogInfo) return;
    if (!ownerUser) return;

    const messageInput = MessageService.findMessageInput(messageInputs, currentDialogInfo.id, currentDialogInfo?.type);
    if (!messageInput) return;
    
    if (!messageInput.text && messageInput.attachments.length === 0) return;
    if (messageInput.text.length > 4096) return;

    const tempMessage: Message = { // to display, will replaced by message from api
      id: uuid(),
      apiId: null,
      text: messageInput.text,
      senderUser: ownerUser,
      attachments: [],
      status: MessageSendingStatus.isSending,
      sentAtTotalMilliseconds: new Date().getTime()
    }
    MessageService.addSendingMessage(dispatch, tempMessage);
    dispatch(clearCurrentDialogMessageInput());

    const sendMessageDTO: SendMessageContainerDTO = {
      toDialogId: currentDialogInfo.id,
      dialogType: currentDialogInfo.type,
      sendMessageDTO: {
        text: messageInput.text,
        sendAttachmentDTOs: [] // will updated
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