import React from "react";
import defaultAvatar from "../../../public/defaultAvatar.jpg";

import styles from "./DialogListItem.module.css";

export interface DialogListItemProps {
  name: string;
  avatarUrl?: string;
  onClick?: () => void;
  lastMessageText?: string;
  isLastMessageMy?: boolean;
  notificationCount?: number;
}

const DialogListItem: React.FC<DialogListItemProps> = (props) => {
  return (
    <div className={styles.dialog}>
      <div className={styles.avatarContainer}>
        {props.avatarUrl ?
          <img src="" className={styles.avatar} />
          :
          <img src={defaultAvatar} className={styles.avatar} />
        }
      </div>
      <div onClick={props.onClick} className={styles.container}>
        <span className={styles.name}>{props.name}</span>
        <span className={styles.lastMessageText}>{props.isLastMessageMy && "Вы: "}{props.lastMessageText}</span>
      </div>
    </div>
  )
}

export default DialogListItem;