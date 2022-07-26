import * as React from "react";
import Message from "../../models/Message";

import styles from "./MessageListItem.module.css";

interface MessageListItemProps {
  message: Message;
}

const MessageListItem: React.FC<MessageListItemProps> = ({ message }) => {
  return (
    <div className={styles.item}>
      {message.text}
    </div>
  );
}

export default MessageListItem;