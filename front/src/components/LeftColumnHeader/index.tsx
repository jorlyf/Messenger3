import * as React from "react";
import DialogAndUserSearchContainer from "../../containers/UserSearchContainer";
import MenuContainer from "../../containers/MenuContainer";

import styles from "./LeftColumnHeader.module.css";

interface LeftColumnHeaderProps {
  handleSearchResultUserItemClick: (userId: number) => void;
}

const LeftColumnHeader: React.FC<LeftColumnHeaderProps> = ({ handleSearchResultUserItemClick }) => {
  return (
    <header className={styles.header}>
      <div className={styles.menu}>
        <MenuContainer />
      </div>
      <div className={styles.search}>
        <DialogAndUserSearchContainer
          handleUserItemClick={handleSearchResultUserItemClick}
          clearAfterUserItemClick={true}
        />
      </div>
    </header>
  );
}

export default LeftColumnHeader;