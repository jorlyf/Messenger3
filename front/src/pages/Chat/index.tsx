import * as React from "react";
import { useParams } from "react-router";
import MessageListContainer from "../../containers/MessageListContainer";
import ChatInputContainer from "../../containers/ChatInputContainer";
import useChatPage from "./useChatPage";

import styles from "./Chat.module.css";

const Chat: React.FC = () => {
  const { chatId } = useParams();
  const { currentDialog, handleSendMessage } = useChatPage(chatId);

  return (
    <div className={styles.chat}>
      {currentDialog &&
        <>
          <MessageListContainer
            dialog={currentDialog}
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