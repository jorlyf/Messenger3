import * as React from "react";
import { DialogTypes } from "../../entities/db/DialogModel";
import Message from "../../entities/local/Message";
import MessageListItem from "../MessageListItem";

import styles from "./MessageList.module.css";

interface MessageListProps {
  dialogId: number;
  dialogType: DialogTypes;
  items: Message[];
}

const MessageList: React.FC<MessageListProps> = ({ dialogId, dialogType, items }) => {

  const scrollListToBottom = (behavior: string = "smooth") => {
    endListRef.current?.scrollIntoView({
      block: "center",
      behavior: behavior
    });
  }

  const endListRef: any = React.useRef(null);
  React.useEffect(() => {
    scrollListToBottom("smooth");
  }, [items]);

  React.useEffect(() => {
    scrollListToBottom("auto");
  }, [dialogId, dialogType]);

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