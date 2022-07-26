import * as React from "react";
import { useParams } from "react-router";
import { useDispatch } from "react-redux";
import { uuid } from "../../utils";
import ChatService from "../../services/ChatService";
import useAppSelector from "../../hooks/useAppSelector";
import { addCurrentDialogMessage, clearInputMessage, replaceCurrentDialogTempMessage } from "../../redux/slices/chatSlice";
import MessageListContainer from "../../containers/MessageListContainer";
import ChatInputContainer from "../../containers/ChatInputContainer";
import { DialogTypes } from "../../models/DialogModel";
import Message, { MessageSendingStatus } from "../../models/Message";
import MessageDTO from "../../models/dtos/MessageDTO";

import styles from "./Chat.module.css";
import SendMessageContainerDTO from "../../models/dtos/SendMessageContainerDTO";

const Chat: React.FC = () => {
  const { chatId } = useParams();
  const dispatch = useDispatch();

  const allDialogs = useAppSelector(state => state.chat.dialogs);
  const currentDialog = useAppSelector(state => state.chat.currentDialog);
  const ownerUser = useAppSelector(state => state.profile.user);

  const handleSendMessage = async () => {
    if (!currentDialog) return;
    if (!ownerUser) return;

    const tempMessage: Message = { // to display, will replaced by message from api
      id: uuid(),
      text: currentDialog.inputMessage.text,
      senderUser: ownerUser,
      status: MessageSendingStatus.isSending,
      timeMilliseconds: new Date().getMilliseconds()
    }
    dispatch(addCurrentDialogMessage(tempMessage));
    dispatch(clearInputMessage());

    const sendMessageDTO: SendMessageContainerDTO = {
      toId: currentDialog.id,
      message: {
        text: currentDialog.inputMessage.text,
        attachments: currentDialog.inputMessage.attachments
      }
    }
    const apiMessageDTO: MessageDTO | null = await ChatService.sendMessage(dispatch, currentDialog, sendMessageDTO);
    if (!apiMessageDTO) return;

    const toReplaceTempMessage: Message = ChatService.processMessageDTO(apiMessageDTO);
    dispatch(replaceCurrentDialogTempMessage({ message: toReplaceTempMessage, uuid: tempMessage.id }));
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

  return (
    <div className={styles.chat}>
      {currentDialog &&
        <>
          <MessageListContainer
            messages={currentDialog.messages}
          />
          <ChatInputContainer
            handleSubmit={handleSendMessage}
          />
        </>
      }
    </div>
  );
}

export default Chat;