import * as React from "react";
import Dialog, { DialogListItemProps } from "../DialogListItem";

import styles from "./DialogList.module.css";

interface DialogListProps {
  items?: DialogListItemProps[];
}

const DialogList: React.FC<DialogListProps> = ({ items }) => {
  return (
    <div className={styles.dialogList}>
      {items?.map(item => (
        <Dialog key={`${item.type}${item.id}`} {...item} />
      ))}
    </div>
  )
}

export default DialogList;