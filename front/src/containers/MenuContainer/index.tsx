import * as React from "react";
import { useNavigate } from "react-router";
import Menu from "../../components/Menu";
import { MenuItem } from "../../components/Menu/index";
import useAppSelector from "../../hooks/useAppSelector";
import AuthService from "../../services/AuthService";

const MenuContainer: React.FC = () => {
  const navigate = useNavigate();

  const isAuthorized = useAppSelector(state => state.auth.isAuthorized);
  const ownerProfile = useAppSelector(state => state.profile);

  const getItems = React.useCallback(() => {
    if (!isAuthorized) return [];

    if (ownerProfile) {
      const items: MenuItem[] = [
        {
          //iconUrl: "",
          text: "Профиль",
          onClick: () => { navigate("/profile"); }
        },
        {
          //iconUrl: "",
          text: "Выйти",
          onClick: () => { AuthService.logout(); }
        }
      ];

      return items;
    }

    return [];
  }, [navigate, isAuthorized, ownerProfile]);

  return (
    <Menu items={getItems()} />
  );
}

export default MenuContainer;