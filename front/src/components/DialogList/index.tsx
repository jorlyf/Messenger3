import * as React from "react";
import Dialog, { DialogProps } from "../Dialog";

import styles from "./DialogList.module.css";

interface DialogListProps {
  items?: DialogProps[];
}

const DialogList: React.FC<DialogListProps> = ({ items }) => {
  return (
    <div className={styles.dialogList}>
      {items?.map(item => (
        <Dialog {...item} />
      ))}
    </div>
  )
}

export default DialogList;