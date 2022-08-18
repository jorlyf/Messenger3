import * as React from "react";
import { useDispatch } from "react-redux";
import { setCurrentDialogInputMessageText } from "../../redux/slices/chatSlice";
import useAppSelector from "../../hooks/useAppSelector";
import ChatInput from "../../components/ChatInput";
import MessageService from "../../services/MessageService";
import MessageInput from "../../entities/local/MessageInput";

interface ChatInputContainerProps {
  handleSubmit: () => void;
}

const ChatInputContainer: React.FC<ChatInputContainerProps> = ({ handleSubmit }) => {
  const dispatch = useDispatch();

  const [currentInputMessage, setCurrentInputMessage] = React.useState<MessageInput | null>(null);

  const inputMessages = useAppSelector(state => state.chat.inputMessages);
  const currentDialogInfo = useAppSelector(state => state.chat.currentDialogInfo);

  const handleAttach = () => {

  }

  const handleSetText = (value: string) => {
    dispatch(setCurrentDialogInputMessageText(value));
  }

  React.useEffect(() => {
    if (!currentDialogInfo) return;

    const inputMessage = MessageService.findInputMessage(inputMessages, currentDialogInfo.id, currentDialogInfo.type);
    setCurrentInputMessage(inputMessage);
  }, [inputMessages, currentDialogInfo]);

  return (
    <ChatInput
      value={currentInputMessage?.text || ""}
      setValue={handleSetText}
      handleSubmit={handleSubmit}
      handleAttach={handleAttach}
    />
  );
}

export default ChatInputContainer;
