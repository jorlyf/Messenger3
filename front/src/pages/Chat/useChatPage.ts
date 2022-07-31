import * as React from "react";
import { useDispatch } from "react-redux";
import useAppSelector from "../../hooks/useAppSelector";
import { clearCurrentDialogInputMessage, findCurrentDialog } from "../../redux/slices/chatSlice";
import ChatService from "../../services/ChatService";
import DialogModel, { DialogTypes } from "../../entities/db/DialogModel";
import Message, { MessageSendingStatus } from "../../entities/local/Message";
import SendMessageContainerDTO from "../../entities/dtos/SendMessageContainerDTO";
import MessageDTO from "../../entities/dtos/MessageDTO";
import { uuid } from "../../utils";
import MessageService from "../../services/MessageService";

const useChat = (chatId?: string) => {
  const dispatch = useDispatch();

  const [currentDialog, setCurrentDialog] = React.useState<DialogModel | null>(null);

  const allDialogs = useAppSelector(state => state.chat.dialogs);
  const currentDialogInfo = useAppSelector(state => state.chat.currentDialogInfo);
  const ownerUser = useAppSelector(state => state.profile.user);

  const handleSendMessage = async () => {
    if (!currentDialog) return;
    if (!ownerUser) return;

    if (!currentDialog.inputMessage.text && currentDialog.inputMessage.attachments.length === 0) return;

    const tempMessage: Message = { // to display, will replaced by message from api
      id: uuid(),
      text: currentDialog.inputMessage.text,
      senderUser: ownerUser,
      status: MessageSendingStatus.isSending,
      timeMilliseconds: new Date().getTime()
    }
    MessageService.addSendingMessage(dispatch, tempMessage);
    dispatch(clearCurrentDialogInputMessage());

    const sendMessageDTO: SendMessageContainerDTO = {
      toId: currentDialog.id,
      message: {
        text: currentDialog.inputMessage.text,
        attachments: currentDialog.inputMessage.attachments
      }
    }
    const apiMessageDTO: MessageDTO | null = await ChatService.sendMessage(currentDialog, sendMessageDTO);
    if (!apiMessageDTO) {
      MessageService.changeStatusSendingMessage(dispatch, currentDialog.id, currentDialog.type, tempMessage.id, MessageSendingStatus.error);
      return;
    }

    const toReplaceTempMessage: Message = ChatService.processMessageDTO(apiMessageDTO);
    MessageService.replaceSendingMessageByUuid(dispatch, currentDialog.id, currentDialog.type, toReplaceTempMessage, tempMessage.id);
  }

  const handleChangeCurrentDialog = (id: number, type: DialogTypes) => {
    ChatService.changeCurrentDialog(dispatch, id, type, allDialogs);
  }

  React.useEffect(() => {
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

    handleChangeCurrentDialog(id, type);

  }, [chatId]);

  React.useEffect(() => {
    if (!currentDialogInfo) return;

    const dialog = findCurrentDialog(allDialogs, currentDialogInfo);
    setCurrentDialog(dialog);
  }, [allDialogs, currentDialogInfo]);

  return { currentDialog, handleSendMessage };
}

export default useChat;