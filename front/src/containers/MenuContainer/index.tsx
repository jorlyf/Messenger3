import * as React from "react";
import Menu from "../../components/Menu";
import { IMenuItem } from "../../components/Menu/index";

const MenuContainer: React.FC = () => {

  const [items, setItems] = React.useState<IMenuItem[]>([]);

  return (
    <Menu items={[]} />
  );
}

export default MenuContainer;