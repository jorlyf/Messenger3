import * as React from "react";
import useAppSelector from "../../hooks/useAppSelector";
import Message, { MessageSendingStatus } from "../../entities/local/Message";
import defaultAvatar from "../../../public/defaultAvatar.jpg";

import styles from "./MessageListItem.module.css";
import IsLoad from "../IsLoad";
import { getUserDataUrl } from "../../utils";

interface MessageListItemProps {
  message: Message;
}

const MessageListItem: React.FC<MessageListItemProps> = ({ message }) => {

  const ownerUser = useAppSelector(state => state.profile.user);
  const isMessageMy: boolean = message.senderUser.id === ownerUser?.id;

  return (
    <>
      {isMessageMy ?
        <div className={styles.item + " " + styles.my}>
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
        <div className={styles.item}>
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
    </>
  );
}

export default MessageListItem;