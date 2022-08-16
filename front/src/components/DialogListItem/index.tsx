import React from "react";
import { getUserDataUrl } from "../../utils";
import useAppSelector from "../../hooks/useAppSelector";
import DialogService from "../../services/DialogService";
import DialogModel, { DialogTypes } from "../../entities/db/DialogModel";
import defaultAvatar from "../../../public/DefaultAvatar.jpg";

import styles from "./DialogListItem.module.css";

export interface DialogListItemProps {
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

const DialogListItem: React.FC<DialogListItemProps> = (props) => {
  const getLastMessageText = (): string => {
    if (!props.lastMessageText) return "";
    
    if (props.lastMessageText.length > 15) {
      return props.lastMessageText.slice(0, 15) + "...";
    }
    return props.lastMessageText;
  }

  const getName = (): string => {
    if (props.name.length > 14) {
      return props.name.slice(0, 14) + "...";
    }
    return props.name;
  }

  return (
    <div className={`${styles.dialog} ${props.isCurrentDialog && styles.current}`}>
      <div className={styles.avatarContainer}>
        {props.avatarUrl ?
          <img src={getUserDataUrl(props.avatarUrl)} className={styles.avatar} />
          :
          <img src={defaultAvatar} className={styles.avatar} />
        }
      </div>
      <div onClick={props.onClick} className={styles.container}>
        <span className={styles.name}>{getName()}</span>
        <span className={styles.lastMessageText}>{props.isLastMessageMy && "Вы: "}{getLastMessageText()}</span>
      </div>
    </div>
  )
}

export default DialogListItem;