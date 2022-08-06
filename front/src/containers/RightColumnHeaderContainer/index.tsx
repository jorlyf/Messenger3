import * as React from "react";
import { findCurrentDialog } from "../../redux/slices/chatSlice";
import useAppSelector from "../../hooks/useAppSelector";
import RightColumnHeader from "../../components/RightColumnHeader";
import DialogModel from "../../entities/db/DialogModel";

const RightColumnHeaderContainer: React.FC = () => {
  const [currentDialog, setCurrentDialog] = React.useState<DialogModel | null>(null);

  const currentDialogInfo = useAppSelector(state => state.chat.currentDialogInfo);
  const allDialogs = useAppSelector(state => state.chat.dialogs);

  React.useEffect(() => {
    if (!currentDialogInfo) return;

    const dialog = findCurrentDialog(allDialogs, currentDialogInfo);
    setCurrentDialog(dialog);
  }, [allDialogs, currentDialogInfo]);

  return (
    <RightColumnHeader
      dialog={currentDialog !== null}
      dialogName={currentDialog?.name}
      dialogAvatarUrl={currentDialog?.avatarUrl}
    />
  );
}

export default RightColumnHeaderContainer;