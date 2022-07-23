import * as React from "react";
import DialogAndUserSearchContainer from "../../containers/UserSearchContainer";
import MenuContainer from "../../containers/MenuContainer";

import styles from "./LeftColumnHeader.module.css";

const Header: React.FC = () => {
  return (
    <header className={styles.header}>
      <div className={styles.menu}>
        <MenuContainer />
      </div>
      <div className={styles.search}>
        <DialogAndUserSearchContainer />
      </div>
    </header>
  );
}

export default Header;