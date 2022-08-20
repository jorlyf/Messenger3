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
  lastMessageText?: string | null;
  isLastMessageMy?: boolean;
  notificationCount?: number;
}

export interface DialogListItemProps {
  index: number;
  style: any;
  data: DialogItem[];
}

const DialogListItem: React.FC<DialogListItemProps> = ({index, style, data}) => {
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
        <span className={styles.lastMessageText}>{dialog.isLastMessageMy && "Вы: "}{getLastMessageText()}</span>
      </div>
    </div>
  )
}

export default DialogListItem;