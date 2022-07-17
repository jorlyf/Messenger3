import React from "react";

import styles from "./Dialog.module.css";

export interface DialogProps {
  username: string;
  avatarUrl?: string;
  onClick?: () => void;
  lastMessageText?: string;
  isLastMessageMy?: boolean;
  notificationCount?: number;
}

const Dialog: React.FC<DialogProps> = (props) => {
  return (
    <div className={styles.dialog}>

    </div>
  )
}

export default Dialog;