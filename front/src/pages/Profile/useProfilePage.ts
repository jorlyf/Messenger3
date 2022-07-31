import useAppSelector from "../../hooks/useAppSelector";
import defaultAvatar from "../../../public/defaultAvatar.jpg";

const useProfilePage = () => {
  const ownerUser = useAppSelector(state => state.profile.user);

  let login: string | null = null;
  let avatarUrl: string | null = null;
  if (ownerUser) {
    login = ownerUser.login;
    avatarUrl = ownerUser.avatarUrl;
  }

  if (!avatarUrl) {
    avatarUrl = defaultAvatar;
  }
  
  const handleChangeAvatar = () => {
    
  }

  return {
    login,
    avatarUrl,
    handleChangeAvatar
  }
}

export default useProfilePage;