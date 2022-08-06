import { useDispatch } from "react-redux";
import { setAvatarUrl } from "../../redux/slices/profileSlice";
import useAppSelector from "../../hooks/useAppSelector";
import ProfileService from "../../services/ProfileService";

const useProfilePage = () => {
  const dispatch = useDispatch();

  const ownerUser = useAppSelector(state => state.profile.user);

  let login: string | null = null;
  let avatarUrl: string | null = null;
  if (ownerUser) {
    login = ownerUser.login;
    avatarUrl = ownerUser.avatarUrl;
  }

  const handleUploadAvatar = () => {
    const input = document.createElement("input");

    input.type = "file";
    input.multiple = false;
    input.accept = ".jpg, .png, .jpeg";
    input.onchange = (e) => handleSubmitUploadAvatar(e);

    input.click();
  }

  const handleSubmitUploadAvatar = async (e: any) => {
    const file: File = e.path[0].files[0];
    const avatarUrl = await ProfileService.uploadAvatar(file);
    if (!avatarUrl) return;

    dispatch(setAvatarUrl(avatarUrl));
  }

  return {
    login,
    avatarUrl,
    handleUploadAvatar
  }
}

export default useProfilePage;