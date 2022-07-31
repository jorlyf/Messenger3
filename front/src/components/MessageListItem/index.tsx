import * as React from "react";
import useAppSelector from "../../hooks/useAppSelector";
import Message, { MessageSendingStatus } from "../../entities/local/Message";
import defaultAvatar from "../../../public/defaultAvatar.jpg";

import styles from "./MessageListItem.module.css";
import IsLoad from "../IsLoad";

interface MessageListItemProps {
  message: Message;
}

const MessageListItem: React.FC<MessageListItemProps> = ({ message }) => {

  const ownerUser = useAppSelector(state => state.profile.user);
  const isMessageMy: boolean = message.senderUser.id === ownerUser?.id;

  const getAvatarUrl = () => {
    return message.senderUser.avatarUrl ? message.senderUser.avatarUrl : defaultAvatar;
  }

  return (
    <>
      {isMessageMy ?
        <div className={styles.item + " " + styles.my}>
          <div className={styles.loginAndText}>
            <span className={styles.login + " " + styles.my}>{message.senderUser.login}</span>
            <span className={styles.text}>{message.text}</span>
          </div>
          <img className={styles.avatar} src={getAvatarUrl()} />
          {message.status === MessageSendingStatus.isSending &&
            <IsLoad />
          }
          {message.status === MessageSendingStatus.error &&
            <span>ОШИБКА</span>
          }
        </div>
        :
        <div className={styles.item}>
          <img className={styles.avatar} src={getAvatarUrl()} />
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