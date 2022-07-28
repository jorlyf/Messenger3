import React from "react";
import useAppSelector from "../../hooks/useAppSelector";
import { DialogTypes } from "../../models/DialogModel";
import defaultAvatar from "../../../public/defaultAvatar.jpg";

import styles from "./DialogListItem.module.css";

export interface DialogListItemProps {
  id: number;
  type: DialogTypes;
  name: string;
  avatarUrl?: string;
  onClick?: () => void;
  lastMessageText?: string;
  isLastMessageMy?: boolean;
  notificationCount?: number;
}

const DialogListItem: React.FC<DialogListItemProps> = (props) => {
  const currentDialog = useAppSelector(state => state.chat.currentDialog);
  const isCurrentDialog: boolean = props.id === currentDialog?.id && props.type === currentDialog.type;
  
  const getLastMessageText = (): string => {
    if (!props.lastMessageText) return "";
    if (props.lastMessageText.length > 25) {
      return props.lastMessageText.slice(0, 25) + "...";
    }
    return props.lastMessageText;
  }
  return (
    <div className={`${styles.dialog} ${isCurrentDialog && styles.current}`}>
      <div className={styles.avatarContainer}>
        {props.avatarUrl ?
          <img src="" className={styles.avatar} />
          :
          <img src={defaultAvatar} className={styles.avatar} />
        }
      </div>
      <div onClick={props.onClick} className={styles.container}>
        <span className={styles.name}>{props.name}</span>
        <span className={styles.lastMessageText}>{props.isLastMessageMy && "Вы: "}{getLastMessageText()}</span>
      </div>
    </div>
  )
}

export default DialogListItem;