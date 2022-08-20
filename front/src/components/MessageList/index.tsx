import * as React from "react";
import useAppSelector from "../../hooks/useAppSelector";
import MessageListItem from "../MessageListItem";
import { DialogTypes } from "../../entities/local/Dialog";
import Message from "../../entities/local/Message";

import styles from "./MessageList.module.css";

interface MessageListProps {
  dialogId: number;
  dialogType: DialogTypes;
  items: Message[];
  loadMoreItems: () => void;
  loadItemsAvailable: boolean;
}

const MessageList: React.FC<MessageListProps> = ({ dialogId, dialogType, items, loadMoreItems, loadItemsAvailable }) => {
  const listRef = React.useRef<any>(null);
  const endListRef = React.useRef<any>(null);

  const owner = useAppSelector(state => state.profile.user);

  const scrollToEnd = (behavior: "auto" | "smooth") => {
    if (!endListRef.current) return;
    endListRef.current.scrollIntoView({
      block: "end",
      behavior
    });
  }

  const onScroll = () => {
    if (!listRef.current) return;
    if (listRef.current.scrollTop < 50) {
      loadMoreItems();
    }
  }

  React.useEffect(() => {
    scrollToEnd("auto");
  }, [dialogId, dialogType]);

  React.useEffect(() => { // handle owner sent message
    if (!loadItemsAvailable) return;
    if (items.length > 0 && items[items.length - 1].senderUser.id === owner?.id) {
      scrollToEnd("auto");
    }
  }, [items]);

  React.useEffect(() => { // handle other sent message
    if (!loadItemsAvailable) return;
    if (items.length > 0 && items[items.length - 1].senderUser.id !== owner?.id) {
      if (!listRef.current) return;

      const scroll = listRef.current.scrollHeight - (listRef.current.scrollTop + listRef.current.clientHeight) < 200;
      if (scroll) {
        scrollToEnd("smooth");
      }
    }
  }, [items]);


  return (
    <div ref={listRef} onScroll={onScroll} className={styles.listContainer}>
      {items.map(message => (
        <MessageListItem
          key={message.id}
          data={message}
        />
      ))}
      <div ref={endListRef} />
    </div>
  );
}

export default MessageList;