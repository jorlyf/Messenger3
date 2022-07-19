import * as React from "react";
import { DialogAndUserSearchResultItems } from "../../containers/DialogAndUserSearchContainer";
import useOutsideClick from "../../hooks/useOutsideClick";

import styles from "./DialogAndUserSearchResult.module.css";

interface DialogAndUserSearchResultProps {
  items: DialogAndUserSearchResultItems;
  handleOutsideClick?: () => void;
}

const DialogAndUserSearchResult: React.FC<DialogAndUserSearchResultProps> = ({ items, handleOutsideClick }) => {
  const listRef = React.useRef(null);

  if (handleOutsideClick) {
    useOutsideClick(handleOutsideClick, listRef);
  }

  return (
    <>
      {(items.users.length > 0 || items.dialogs.length > 0) &&
        <div ref={listRef} className={styles.list}>
          {items.users.map(user => (
            <div key={user.id} className={styles.item}>
              {user.avatarUrl &&
                <img src={user.avatarUrl} alt="avatar" />
              }
              <span>{user.login}</span>
            </div>
          ))}
          {items.dialogs.map(dialog => (
            <div key={dialog.id} className={styles.item}>
              {dialog.avatarUrl &&
                <img src={dialog.avatarUrl} alt="avatar" />
              }
              <span>{dialog.name}</span>
            </div>
          ))}
        </div>}
    </>
  );
}

export default React.memo(DialogAndUserSearchResult);
