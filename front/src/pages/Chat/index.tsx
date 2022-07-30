import * as React from "react";
import { useParams } from "react-router";
import MessageListContainer from "../../containers/MessageListContainer";
import ChatInputContainer from "../../containers/ChatInputContainer";

import styles from "./Chat.module.css";
import useChat from "./useChat";

const Chat: React.FC = () => {
  const { chatId } = useParams();
  const { currentDialog, handleSendMessage } = useChat(chatId);

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