import * as React from "react";
import MessageModel from "../../models/MessageModel";

import styles from "./MessageListItem.module.css";

interface MessageListItemProps {
  message: MessageModel;
}

const MessageListItem: React.FC<MessageListItemProps> = ({ message }) => {
  return (
    <div className={styles.item}>
      {message.text}
    </div>
  );
}

export default MessageListItem;