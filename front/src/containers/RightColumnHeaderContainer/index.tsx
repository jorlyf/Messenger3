import * as React from "react";
import useAppSelector from "../../hooks/useAppSelector";
import DialogService from "../../services/DialogService";
import RightColumnHeader from "../../components/RightColumnHeader";
import Dialog from "../../entities/local/Dialog";

const RightColumnHeaderContainer: React.FC = () => {
  const [currentDialog, setCurrentDialog] = React.useState<Dialog | null>(null);

  const currentDialogInfo = useAppSelector(state => state.chat.currentDialogInfo);
  const allDialogs = useAppSelector(state => state.chat.dialogs);

  React.useEffect(() => {
    if (!currentDialogInfo) return;

    const dialog = DialogService.findCurrentDialog(allDialogs, currentDialogInfo);
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