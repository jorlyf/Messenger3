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

  const getTime = (): string => {
    const now = new Date();
    const messageSentTime = new Date(data.sentAtTotalMilliseconds);
    if (now.toDateString() === messageSentTime.toDateString()) {
      return messageSentTime.toLocaleString("ru", { hour: "2-digit", minute: "2-digit" });;
    }

    return messageSentTime.toLocaleString("ru", { year: "numeric", month: "2-digit", day: "2-digit" });
  }

  return (
    <div className={styles.container}>
      {isMessageMy ?
        <>
          <div className={styles.item + " " + styles.my}>
            <div className={styles.headAndText}>
              <div className={styles.timeAndLogin}>
                <span className={styles.time + " " + styles.my}>{getTime()}</span>
                <span className={styles.login}>{data.senderUser.login}</span>
              </div>
              <span className={styles.text + " " + styles.my}>{data.text}</span>
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
          {data.attachments.length === 1 &&
            <div className={styles.oneAttachment + " " + styles.my}>
              <img key={data.attachments[0].id} className={styles.photoAttachment} src={getUserDataUrl(data.attachments[0].url)} />
            </div>
          }
          {data.attachments.length > 0 && data.attachments.length !== 1 &&
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
            <div className={styles.headAndText}>
              <div className={styles.timeAndLogin}>
                <span className={styles.login}>{data.senderUser.login}</span>
                <span className={styles.time}>{getTime()}</span>
              </div>
              <span className={styles.text}>{data.text}</span>
            </div>
          </div>

          {data.attachments.length === 1 &&
            <div className={styles.oneAttachment}>
              <img key={data.attachments[0].id} className={styles.photoAttachment} src={getUserDataUrl(data.attachments[0].url)} />
            </div>
          }
          {data.attachments.length > 0 && data.attachments.length !== 1 &&
            <div className={styles.attachments}>
              {data.attachments.map(x => {
                if (x.type === AttachmentTypes.photo) {
                  return <img key={x.id} className={styles.photoAttachment} src={getUserDataUrl(x.url)} />
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