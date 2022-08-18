import * as React from "react";
import { getUserDataUrl } from "../../utils";
import { VariableSizeList } from "react-window";
import AutoSizer from "react-virtualized-auto-sizer";
import useAppSelector from "../../hooks/useAppSelector";
import IsLoad from "../IsLoad";
import { DialogTypes } from "../../entities/db/DialogModel";
import Message, { MessageSendingStatus } from "../../entities/local/Message";
import defaultAvatar from "../../../public/DefaultAvatar.jpg";

import styles from "./MessageList.module.css";

interface MessageListProps {
  dialogId: number;
  dialogType: DialogTypes;
  items: Message[];
}

interface RowProps {
  index: number;
  style: any;
}

const MessageList: React.FC<MessageListProps> = ({ dialogId, dialogType, items }) => {
  const listRef = React.useRef<any>(null);
  const rowHeights = React.useRef<number[]>([]);

  const Row: React.FC<RowProps> = ({ index, style }) => {
    const ref = React.useRef<any>(null);
    const message = items[index];

    const getGap = () => {
      return { paddingTop: index === 0 ? 0 : 15 }
    }

    const ownerUser = useAppSelector(state => state.profile.user);
    const isMessageMy: boolean = message.senderUser.id === ownerUser?.id;

    React.useEffect(() => {
      if (ref.current) {
        setRowHeight(index, ref.current.clientHeight);
      }
    }, [ref]);

    return (
      <div style={style} className={styles.container}>
        {isMessageMy ?
          <div style={getGap()} ref={ref} className={styles.item + " " + styles.my}>
            <div className={styles.loginAndText}>
              <span className={styles.login + " " + styles.my}>{message.senderUser.login}</span>
              <span className={styles.text}>{message.text}</span>
            </div>
            {message.senderUser.avatarUrl ?
              <img className={styles.avatar} src={getUserDataUrl(message.senderUser.avatarUrl)} />
              :
              <img className={styles.avatar} src={defaultAvatar} />
            }
            {message.status === MessageSendingStatus.isSending &&
              <IsLoad />
            }
            {message.status === MessageSendingStatus.error &&
              <span>ОШИБКА</span>
            }
          </div>
          :
          <div style={getGap()} ref={ref} className={styles.item}>
            {message.senderUser.avatarUrl ?
              <img className={styles.avatar} src={getUserDataUrl(message.senderUser.avatarUrl)} />
              :
              <img className={styles.avatar} src={defaultAvatar} />
            }
            <div className={styles.loginAndText}>
              <span className={styles.login}>{message.senderUser.login}</span>
              <span className={styles.text}>{message.text}</span>
            </div>
          </div>
        }
      </div>
    );
  }

  const scrollToEnd = () => {
    if (listRef?.current?.scrollToItem) {
      listRef.current.scrollToItem(items.length - 1, "end");
    }
  }

  const getRowHeight = (index: number) => {
    return rowHeights?.current[index] || 60;
  }

  const setRowHeight = (index: number, height: number) => {
    if (listRef?.current?.resetAfterIndex) {
      listRef.current.resetAfterIndex(0);
      rowHeights.current[index] = height;
    }
  }

  React.useEffect(() => {
    scrollToEnd();
  }, [items]);

  React.useEffect(() => {
    scrollToEnd();
  }, [dialogId, dialogType]);

  return (
    <div className={styles.listContainer}>
      <AutoSizer>
        {({ height, width }) => (
          <VariableSizeList
            height={height}
            width={width}
            estimatedItemSize={60}

            itemKey={(index) => items[index].id}
            itemSize={getRowHeight}
            itemCount={items.length}

            ref={listRef}
          >
            {Row}
          </VariableSizeList>
        )}
      </AutoSizer>
    </div>
  );
}

export default MessageList;