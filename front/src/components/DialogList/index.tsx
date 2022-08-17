import * as React from "react";
import { FixedSizeList } from "react-window";
import Dialog, { DialogItem } from "../DialogListItem";

import styles from "./DialogList.module.css";

interface DialogListProps {
  items: DialogItem[];
}

const DialogList: React.FC<DialogListProps> = ({ items }) => {
  const ref = React.useRef<any>(null);

  return (
    <div className={styles.dialogList}>
      <FixedSizeList
        height={550}
        width={350}

        itemData={items}
        itemCount={items.length}
        itemSize={100}
        itemKey={(index, data) => data[index].id}
        overscanCount={2}

        ref={ref}
      >
        {Dialog}
      </FixedSizeList>
    </div>
  )
}

export default DialogList;