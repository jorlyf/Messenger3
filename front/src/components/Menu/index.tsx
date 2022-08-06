import * as React from "react";

import styles from "./Menu.module.css";

export interface MenuItem {
  text: string;
  iconUrl?: string;
  onClick: () => void | undefined | Promise<void>;
}

interface IMenuProps {
  items: MenuItem[];
}

const Menu: React.FC<IMenuProps> = ({ items }) => {

  const [isIpen, setIsOpen] = React.useState<boolean>(false);

  return (
    <>
      <div onClick={() => setIsOpen(prev => !prev)} className={styles.menu}>
        <span className={styles.middle} />
      </div>

      {isIpen && items?.length > 0 &&
        <div className={styles.content}>
          {items?.map(item => (
            <div key={item.text} className={styles.item}>
              {item.iconUrl && <img src={item.iconUrl} className={styles.icon} alt="" />}
              <span onClick={() => { item.onClick(); setIsOpen(false); }} className={styles.text}>{item.text}</span>
            </div>
          ))}
        </div>
      }
    </>
  );
}

export default Menu;