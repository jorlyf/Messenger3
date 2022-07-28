import * as React from "react";
import Message from "../../models/Message";
import MessageListItem from "../MessageListItem";

import styles from "./MessageList.module.css";

interface MessageListProps {
  items: Message[];
}

const MessageList: React.FC<MessageListProps> = ({ items }) => {
  const scrollListToBottom = () => {
    endListRef.current?.scrollIntoView({
      block: "center",
      behavior: "smooth"
    });
  }

  const endListRef: any = React.useRef(null);
  React.useEffect(() => {
    scrollListToBottom();
  }, [items]);

  return (
    <div className={styles.list}>
      {items.map(item =>
        <MessageListItem
          key={item.id}
          message={item}
        />
      )}
      <div ref={endListRef} />
    </div>
  );
}

export default MessageList;