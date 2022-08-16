import * as React from "react";
import { useDispatch } from "react-redux";
import { addUserId, clearUserIds, closeCreateDialogModal, removeUserId } from "../../redux/slices/createGroupDialogSlice";
import useAppSelector from "../../hooks/useAppSelector";
import UserModel from "../../entities/db/UserModel";
import { DialogTypes } from "../../entities/db/DialogModel";
import UserService from "../../services/UserService";
import DialogService from "../../services/DialogService";

const useCreateGroupDialogModal = () => {
  const dispatch = useDispatch();

  const ownerUserId = useAppSelector(state => state.profile.user?.id);
  const allDialogs = useAppSelector(state => state.chat.dialogs);
  const dialogsFetched = useAppSelector(state => state.chat.dialogsFetched);

  const open = useAppSelector(state => state.createGroupDialog.open);
  const userIds = useAppSelector(state => state.createGroupDialog.userIds);
  const [users, setUsers] = React.useState<UserModel[]>([]);

  const handleAddUserId = async (userId: number) => {
    if (userIds.includes(userId)) return;

    dispatch(addUserId(userId));
    const user = await UserService.getUserById(userId);
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

    const dialog = await DialogService.createGroupDialog(ownerUserId, [...userIds, ownerUserId]);
    if (!dialog) {
      console.error("Dialog is null");
      return;
    }

    DialogService.changeCurrentDialog(dispatch, dialog.id, DialogTypes.group, allDialogs, dialogsFetched);
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