import * as React from "react";
import { useParams } from "react-router";
import { useDispatch } from "react-redux";
import useAppSelector from "../../hooks/useAppSelector";
import MessageListContainer from "../../containers/MessageListContainer";
import ChatInputContainer from "../../containers/ChatInputContainer";

import styles from "./Chat.module.css";

const Chat: React.FC = () => {
  const { chatId } = useParams();

  const allDialogs = useAppSelector(state => state.chat.dialogs);
  const currentDialog = useAppSelector(state => state.chat.currentDialog);

  const handleSendMessage = () => {

  }

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