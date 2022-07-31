import React from "react";

import styles from "./RightColumnHeader.module.css";

interface RightColumnHeaderProps {
  dialog: boolean;
  dialogName?: string;
  dialogAvatarUrl?: string;
}

const RightColumnHeader: React.FC<RightColumnHeaderProps> = (props) => {
  return (
    <header className={styles.header}>
      {props.dialog &&
        <div className={styles.currentDialog}>
          <img className={styles.currentDialogAvatar} src={props.dialogAvatarUrl} />
          <span className={styles.currentDialogName}>{props.dialogName}</span>
        </div>
      }
    </header>
  )
}

export default RightColumnHeader;