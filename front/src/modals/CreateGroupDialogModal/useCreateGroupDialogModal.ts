import * as React from "react";
import { useDispatch } from "react-redux";
import { addUserId, clearUserIds, removeUserId } from "../../redux/slices/createGroupDialogSlice";
import useAppSelector from "../../hooks/useAppSelector";
import ProfileService from "../../services/ProfileService";
import UserModel from "../../entities/db/UserModel";

const useCreateGroupDialogModal = () => {
  const dispatch = useDispatch();

  const open = useAppSelector(state => state.createGroupDialog.open);
  const userIds = useAppSelector(state => state.createGroupDialog.userIds);
  const [users, setUsers] = React.useState<UserModel[]>([]);

  const handleAddUserId = async (userId: number) => {
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
  const handleSubmitCreate = () => {
    if (userIds.length === 0) return;


  }

  return {
    open,
    users,
    handleAddUserId,
    handleRemoveUserId,
    handleClearUserIds,
    handleSubmitCreate
  }
}

export default useCreateGroupDialogModal;