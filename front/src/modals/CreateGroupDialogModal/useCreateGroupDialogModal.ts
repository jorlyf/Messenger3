import * as React from "react";
import { useDispatch } from "react-redux";
import { addUserId, clearUserIds, closeCreateDialogModal, removeUserId } from "../../redux/slices/createGroupDialogSlice";
import useAppSelector from "../../hooks/useAppSelector";
import ProfileService from "../../services/ProfileService";
import UserModel from "../../entities/db/UserModel";
import ChatService from "../../services/ChatService";
import { DialogTypes } from "../../entities/db/DialogModel";

const useCreateGroupDialogModal = () => {
  const dispatch = useDispatch();

  const ownerUserId = useAppSelector(state => state.profile.user?.id);
  const allDialogs = useAppSelector(state => state.chat.dialogs);

  const open = useAppSelector(state => state.createGroupDialog.open);
  const userIds = useAppSelector(state => state.createGroupDialog.userIds);
  const [users, setUsers] = React.useState<UserModel[]>([]);

  const handleAddUserId = async (userId: number) => {
    if (userIds.includes(userId)) return;

    dispatch(addUserId(userId));
    const user = await ProfileService.GetUser(userId);
    if (user === null) {
      handleRemoveUserId(userId);
      return;
    }
    setUsers(prev => [...prev, user]);
  }
  const handleRemoveUserId = (userId: number) => {
    dispatch(removeUserId(userId));
    setUsers(prev => prev.filter(x => x.id !== userId));
  }
  const handleClearUserIds = () => {
    dispatch(clearUserIds());
  }
  const handleSubmitCreate = async () => {
    if (userIds.length === 0) return;
    if (!ownerUserId) return;

    const dialog = await ChatService.createGroupDialog(ownerUserId, [...userIds, ownerUserId]);
    if (!dialog) {
      console.error("Dialog is null");
      return;
    }

    ChatService.changeCurrentDialog(dispatch, dialog.groupId, DialogTypes.group, allDialogs);
  }
  const validateSubmit = (): boolean => {
    if (userIds.length === 0) return false;

    return true;
  }

  const handlePressEscape = (e: any) => {
    if (e.keyCode === 27) { // keyCode 27 - Escape
      dispatch(closeCreateDialogModal());
    }
  }

  React.useEffect(() => {
    document.addEventListener("keydown", handlePressEscape);

    return () => document.removeEventListener("keydown", handlePressEscape);
  }, []);

  const submitActive: boolean = validateSubmit();

  return {
    open,
    users,
    handleAddUserId,
    handleRemoveUserId,
    handleClearUserIds,
    handleSubmitCreate,
    submitActive
  }
}

export default useCreateGroupDialogModal;