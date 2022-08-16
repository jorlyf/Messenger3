import * as React from "react";
import { useNavigate } from "react-router-dom";
import LeftColumnHeader from "../../components/LeftColumnHeader";

const LeftColumnHeaderContainer: React.FC = () => {
  const navigate = useNavigate();

  const handleSearchResultUserItemClick = (userId: number) => {
    navigate(`/user=${userId}`);
  }

  return (
    <LeftColumnHeader
      handleSearchResultUserItemClick={handleSearchResultUserItemClick}
    />
  )
}

export default LeftColumnHeaderContainer;