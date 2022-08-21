import * as React from "react";
import { FixedSizeList, ListOnScrollProps } from "react-window";
import AutoSizer from "react-virtualized-auto-sizer";
import Dialog, { DialogItem } from "../DialogListItem";

import styles from "./DialogList.module.css";

interface DialogListProps {
  items: DialogItem[];
  loadMoreItems: () => void;
}

const DialogList: React.FC<DialogListProps> = ({ items, loadMoreItems }) => {
  const ref = React.useRef<any>(null);

  const dialogHeight = 100;

  const onScroll = (props: ListOnScrollProps) => {
    if (!ref.current) return;
  
    if (props.scrollOffset + ref.current.props.height > dialogHeight * items.length - 100) {
      loadMoreItems();
    }
  }

  return (
    <div className={styles.dialogList}>
      <AutoSizer>
        {({ height, width }) => (
          <FixedSizeList
            height={height}
            width={width}

            itemData={items}
            itemCount={items.length}
            itemSize={dialogHeight}
            itemKey={(index, data) => `${data[index].id}-${data[index].type}`}
            overscanCount={2}

            onScroll={onScroll}

            ref={ref}
          >
            {Dialog}
          </FixedSizeList>
        )}
      </AutoSizer>
    </div>
  )
}

export default DialogList;