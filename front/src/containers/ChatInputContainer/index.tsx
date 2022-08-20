import * as React from "react";
import { useDispatch } from "react-redux";
import { setCurrentDialogMessageInputText } from "../../redux/slices/chatSlice";
import useAppSelector from "../../hooks/useAppSelector";
import ChatInput from "../../components/ChatInput";
import MessageService from "../../services/MessageService";
import MessageInput from "../../entities/local/MessageInput";

interface ChatInputContainerProps {
  handleSubmit: () => void;
}

const ChatInputContainer: React.FC<ChatInputContainerProps> = ({ handleSubmit }) => {
  const dispatch = useDispatch();

  const [currentMessageInput, setCurrentMessageInput] = React.useState<MessageInput | null>(null);

  const messageInputs = useAppSelector(state => state.chat.messageInputs);
  const currentDialogInfo = useAppSelector(state => state.chat.currentDialogInfo);

  const handleAttach = () => {

  }

  const handleSetText = (value: string) => {
    dispatch(setCurrentDialogMessageInputText(value));
  }

  React.useEffect(() => {
    if (!currentDialogInfo) return;

    const messageInput = MessageService.findMessageInput(messageInputs, currentDialogInfo.id, currentDialogInfo.type);
    setCurrentMessageInput(messageInput);
  }, [messageInputs, currentDialogInfo]);

  return (
    <ChatInput
      value={currentMessageInput?.text || ""}
      setValue={handleSetText}
      handleSubmit={handleSubmit}
      handleAttach={handleAttach}
    />
  );
}

export default ChatInputContainer;
