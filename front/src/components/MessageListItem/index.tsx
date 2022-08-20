import * as React from "react";
import { getUserDataUrl } from "../../utils";
import useAppSelector from "../../hooks/useAppSelector";
import IsLoad from "../IsLoad";
import Message, { MessageSendingStatus } from "../../entities/local/Message";
import defaultAvatar from "../../../public/defaultAvatar.jpg";

import styles from "./MessageListItem.module.css";

export interface MessageListItemProps {
  data: Message;
}

const MessageListItem: React.FC<MessageListItemProps> = ({ data }) => {
  const ownerUser = useAppSelector(state => state.profile.user);
  const isMessageMy: boolean = data.senderUser.id === ownerUser?.id;

  return (
    <div className={styles.container}>
      {isMessageMy ?
        <div className={styles.item + " " + styles.my}>
          <div className={styles.loginAndText}>
            <span className={styles.login + " " + styles.my}>{data.senderUser.login}</span>
            <span className={styles.text}>{data.text}</span>
          </div>
          {data.senderUser.avatarUrl ?
            <img className={styles.avatar} src={getUserDataUrl(data.senderUser.avatarUrl)} />
            :
            <img className={styles.avatar} src={defaultAvatar} />
          }
          {data.status === MessageSendingStatus.isSending &&
            <IsLoad />
          }
          {data.status === MessageSendingStatus.error &&
            <span>ОШИБКА</span>
          }
        </div>
        :
        <div className={styles.item}>
          {data.senderUser.avatarUrl ?
            <img className={styles.avatar} src={getUserDataUrl(data.senderUser.avatarUrl)} />
            :
            <img className={styles.avatar} src={defaultAvatar} />
          }
          <div className={styles.loginAndText}>
            <span className={styles.login}>{data.senderUser.login}</span>
            <span className={styles.text}>{data.text}</span>
          </div>
        </div>
      }
    </div>
  );
}

export default MessageListItem;