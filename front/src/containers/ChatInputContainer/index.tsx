import * as React from "react";
import { useDispatch } from "react-redux";
import { setCurrentDialogInputMessageText } from "../../redux/slices/chatSlice";
import useAppSelector from "../../hooks/useAppSelector";
import DialogService from "../../services/DialogService";
import ChatInput from "../../components/ChatInput";
import DialogModel from "../../entities/db/DialogModel";

interface ChatInputContainerProps {
  handleSubmit: () => void;
}

const ChatInputContainer: React.FC<ChatInputContainerProps> = ({ handleSubmit }) => {
  const dispatch = useDispatch();

  const [currentDialog, setCurrentDialog] = React.useState<DialogModel | null>(null);

  const allDialogs = useAppSelector(state => state.chat.dialogs);
  const currentDialogInfo = useAppSelector(state => state.chat.currentDialogInfo);

  const handleAttach = () => {

  }

  const handleSetText = (value: string) => {
    dispatch(setCurrentDialogInputMessageText(value));
  }

  React.useEffect(() => {
    if (!currentDialogInfo) return;

    const dialog = DialogService.findCurrentDialog(allDialogs, currentDialogInfo);
    setCurrentDialog(dialog);
  }, [allDialogs, currentDialogInfo]);

  return (
    <ChatInput
      value={currentDialog?.inputMessage?.text || ""}
      setValue={handleSetText}
      handleSubmit={handleSubmit}
      handleAttach={handleAttach}
    />
  );
}

export default ChatInputContainer;
