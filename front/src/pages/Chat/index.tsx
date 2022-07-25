import * as React from "react";
import { useParams } from "react-router";
import { useDispatch } from "react-redux";
import useAppSelector from "../../hooks/useAppSelector";
import MessageListContainer from "../../containers/MessageListContainer";
import ChatInputContainer from "../../containers/ChatInputContainer";

import styles from "./Chat.module.css";
import { DialogTypes } from "../../models/DialogModel";
import ChatService from "../../services/ChatService";
import MessageModel from "../../models/MessageModel";

const Chat: React.FC = () => {
  const { chatId } = useParams();
  const dispatch = useDispatch();

  const allDialogs = useAppSelector(state => state.chat.dialogs);
  const currentDialog = useAppSelector(state => state.chat.currentDialog);

  const handleSendMessage = () => {

  }

  const addMessage = (message: MessageModel) => {
    
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
          <MessageListContainer />
          <ChatInputContainer
            handleSubmit={handleSendMessage}
          />
        </>
      }
    </div>
  );
}

export default Chat;