import React from "react";
import defaultAvatar from "../../../public/defaultAvatar.jpg";
import { getUserDataUrl } from "../../utils";

import styles from "./RightColumnHeader.module.css";

interface RightColumnHeaderProps {
  dialog: boolean;
  dialogName?: string;
  dialogAvatarUrl?: string | null;
}

const RightColumnHeader: React.FC<RightColumnHeaderProps> = (props) => {
  return (
    <header className={styles.header}>
      {props.dialog &&
        <div className={styles.currentDialog}>
          {props.dialogAvatarUrl ?
            <img className={styles.currentDialogAvatar} src={getUserDataUrl(props.dialogAvatarUrl)} />
            :
            <img className={styles.currentDialogAvatar} src={defaultAvatar} />
          }
          <span className={styles.currentDialogName}>{props.dialogName}</span>
        </div>
      }
    </header>
  )
}

export default RightColumnHeader;