import * as React from "react";
import { useDispatch } from "react-redux";
import CreateGroupDialogButton from "../../components/CreateGroupDialogButton";
import { closeCreateDialogModal, openCreateDialogModal } from "../../redux/slices/createGroupDialogSlice";

const CreateGroupDialogButtonContainer: React.FC = () => {
  const dispatch = useDispatch();

  const handleOpen = () => {
    dispatch(openCreateDialogModal());
  }
  const handleClose = () => {
    dispatch(closeCreateDialogModal());
  }

  return (
    <CreateGroupDialogButton 
      handleOpen={handleOpen}
    />
  );
}

export default CreateGroupDialogButtonContainer;