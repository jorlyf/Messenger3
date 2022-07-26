import React from "react";

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

    </div>
  )
}

export default DialogListItem;