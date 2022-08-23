import React from "react";
import { getUserDataUrl } from "../../utils";
import { DialogTypes } from "../../entities/local/Dialog";
import defaultAvatar from "../../../public/DefaultAvatar.jpg";

import styles from "./DialogListItem.module.css";

export interface DialogItem {
  id: number;
  type: DialogTypes;
  name: string;
  avatarUrl: string | null;
  isCurrentDialog: boolean;
  onClick?: () => void;
  lastUpdateTotalMilliseconds: number;
  lastMessageText?: string | null;
  isLastMessageMy?: boolean;
  notificationCount?: number;
}

export interface DialogListItemProps {
  index: number;
  style: any;
  data: DialogItem[];
}

const DialogListItem: React.FC<DialogListItemProps> = ({ index, style, data }) => {
  const dialog = data[index];

  const getLastMessageText = (): string => {
    if (!dialog.lastMessageText) return "";

    if (dialog.lastMessageText.length > 15) {
      return dialog.lastMessageText.slice(0, 15) + "...";
    }
    return dialog.lastMessageText;
  }

  const getName = (): string => {
    if (dialog.name.length > 14) {
      return dialog.name.slice(0, 14) + "...";
    }
    return dialog.name;
  }

  const getTime = (): string => {
    const now = new Date();
    const dialogLastUpdate = new Date(dialog.lastUpdateTotalMilliseconds);
    if (now.toDateString() === dialogLastUpdate.toDateString()) {
      return dialogLastUpdate.toLocaleString("ru", { hour: "2-digit", minute: "2-digit" });;
    }

    return dialogLastUpdate.toLocaleString("ru", { year: "numeric", month: "2-digit", day: "2-digit" });
  }

  return (
    <div style={style} className={`${styles.dialog} ${dialog.isCurrentDialog && styles.current}`}>
      <div className={styles.avatarContainer}>
        {dialog.avatarUrl ?
          <img src={getUserDataUrl(dialog.avatarUrl)} className={styles.avatar} />
          :
          <img src={defaultAvatar} className={styles.avatar} />
        }
      </div>
      <div onClick={dialog.onClick} className={styles.container}>
        <span className={styles.name}>{getName()}</span>
        <div className={styles.lastMessageContainer}>
          <span className={styles.lastMessageText}>{dialog.isLastMessageMy && "Вы: "}{getLastMessageText()}</span>
          <span className={styles.time}>{getTime()}</span>
        </div>
      </div>
    </div>
  )
}

export default DialogListItem;