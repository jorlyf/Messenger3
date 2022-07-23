import * as React from "react";
import { useDispatch } from "react-redux";
import ChatInput from "../../components/ChatInput";
import useAppSelector from "../../hooks/useAppSelector";
import MessageDTO from "../../models/dtos/MessageDTO";
import { setTextInputMessage } from "../../redux/slices/chatSlice";

interface ChatInputContainerProps {
  handleSubmit: () => void;
}

const ChatInputContainer: React.FC<ChatInputContainerProps> = ({ handleSubmit }) => {
  const dispatch = useDispatch();

  const inputMessage = useAppSelector(state => state.chat.currentDialog?.inputMessage);

  const handleAttach = () => {

  }

  const handleSetText = (value: string) => {
    dispatch(setTextInputMessage(value));
  }

  return (
    <ChatInput
      value={inputMessage?.text || ""}
      setValue={handleSetText}
      handleSubmit={handleSubmit}
      handleAttach={handleAttach}
    />
  );
}

export default ChatInputContainer;
