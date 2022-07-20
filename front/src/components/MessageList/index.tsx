import * as React from "react";
import MessageModel from "../../models/MessageModel";
import MessageListItem from "../MessageListItem";

import styles from "./MessageList.module.css";

interface MessageListProps {
  items: MessageModel[];
}

const MessageList: React.FC<MessageListProps> = ({ items }) => {
  return (
    <div className={styles.list}>
      {items.map((item, index) =>
        <MessageListItem
          key={index}
          message={item}
        />
      )}
    </div>
  );
}

export default MessageList;