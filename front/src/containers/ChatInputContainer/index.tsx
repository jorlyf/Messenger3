import * as React from "react";
import { useDispatch } from "react-redux";
import { addCurrentDialogMessageInputAttachments, setCurrentDialogMessageInputText } from "../../redux/slices/chatSlice";
import useAppSelector from "../../hooks/useAppSelector";
import ChatInput from "../../components/ChatInput";
import MessageService from "../../services/MessageService";
import MessageInput from "../../entities/local/MessageInput";
import MessageInputAttachment from "../../entities/local/MessageInputAttachment";
import { AttachmentTypes } from "../../entities/local/Attachment";
import { uuid } from "../../utils";

interface ChatInputContainerProps {
  handleSubmit: () => void;
}

const ChatInputContainer: React.FC<ChatInputContainerProps> = ({ handleSubmit }) => {
  const dispatch = useDispatch();

  const [currentMessageInput, setCurrentMessageInput] = React.useState<MessageInput | null>(null);

  const messageInputs = useAppSelector(state => state.chat.messageInputs);
  const currentDialogInfo = useAppSelector(state => state.chat.currentDialogInfo);

  const handleAttach = () => {
    const input = document.createElement("input");

    input.type = "file";
    input.multiple = true;
    input.accept = ".jpg, .png, .jpeg";
    input.onchange = (e: any) => addAttachments(e.path.at(0).files);

    input.click();
  }

  const addAttachments = (fileList: FileList) => {
    const messageInputAttachments: MessageInputAttachment[] = [];
    for (let i = 0; i < fileList.length; i++) {
      const file = fileList.item(i);
      console.log(file);    
      let type: AttachmentTypes;
      switch (file?.type) {
        case "image/jpeg":
        case "image/png":
          type = AttachmentTypes.photo;
          break;

        default: throw new Error(`unsupported file type - ${file?.type}`);
      }

      messageInputAttachments.push({
        id: uuid(),
        type: type,
        file: file
      });
    }
    dispatch(addCurrentDialogMessageInputAttachments(messageInputAttachments));
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
