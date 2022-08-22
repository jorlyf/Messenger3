import * as React from "react";
import { getUserDataUrl } from "../../utils";
import useAppSelector from "../../hooks/useAppSelector";
import IsLoad from "../IsLoad";
import Message, { MessageSendingStatus } from "../../entities/local/Message";
import defaultAvatar from "../../../public/DefaultAvatar.jpg";

import styles from "./MessageListItem.module.css";
import { AttachmentTypes } from "../../entities/local/Attachment";

export interface MessageListItemProps {
  data: Message;
}

const MessageListItem: React.FC<MessageListItemProps> = ({ data }) => {
  const ownerUser = useAppSelector(state => state.profile.user);
  const isMessageMy: boolean = data.senderUser.id === ownerUser?.id;

  return (
    <div className={styles.container}>
      {isMessageMy ?
        <>
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

          {data.attachments.length > 0 &&
            <div className={styles.attachments + " " + styles.my}>
              {data.attachments.map(x => {
                if (x.type === AttachmentTypes.photo) {
                  return <img key={x.id} className={styles.photoAttachment} src={getUserDataUrl(x.url)} />
                }
              })}
            </div>
          }
        </>
        :
        <>
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

          {data.attachments.length > 0 &&
            <div className={styles.attachments}>
              {data.attachments.map(x => {
                if (x.type === AttachmentTypes.photo) {
                  return <img key={x.id} src={getUserDataUrl(x.url)} />
                }
              })}
            </div>
          }
        </>
      }
    </div>
  );
}

export default MessageListItem;