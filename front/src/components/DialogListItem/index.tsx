import React from "react";
import useAppSelector from "../../hooks/useAppSelector";
import DialogModel, { DialogTypes } from "../../entities/db/DialogModel";
import defaultAvatar from "../../../public/defaultAvatar.jpg";

import styles from "./DialogListItem.module.css";
import { findCurrentDialog } from "../../redux/slices/chatSlice";

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

  const [currentDialog, setCurrentDialog] = React.useState<DialogModel | null>(null);

  const allDialogs = useAppSelector(state => state.chat.dialogs);
  const currentDialogInfo = useAppSelector(state => state.chat.currentDialogInfo);
  const isCurrentDialog: boolean = props.id === currentDialog?.id && props.type === currentDialog.type;

  const getLastMessageText = (): string => {
    if (!props.lastMessageText) return "";
    
    if (props.lastMessageText.length > 15) {
      return props.lastMessageText.slice(0, 15) + "...";
    }
    return props.lastMessageText;
  }

  React.useEffect(() => {
    if (!currentDialogInfo) return;

    const dialog = findCurrentDialog(allDialogs, currentDialogInfo);
    setCurrentDialog(dialog);
  }, [currentDialogInfo]);

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