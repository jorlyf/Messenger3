import * as React from "react";
import { useNavigate, useParams } from "react-router";
import ChatInputContainer from "../../containers/ChatInputContainer";
import { useDispatch } from "react-redux";
import MessageListContainer from "../../containers/MessageListContainer";
import useAppSelector from "../../hooks/useAppSelector";
import ChatService from "../../services/ChatService";
import { DialogTypes } from "../../models/DialogModel";
import { setCurrentDialog } from "../../redux/slices/chatSlice";
import { uuid } from "../../utils";
import MessageDTO from "../../models/dtos/MessageDTO";

import styles from "./Chat.module.css";

const Chat: React.FC = () => {
  const dispatch = useDispatch();

  const { chatId } = useParams();

  const allDialogs = useAppSelector(state => state.chat.dialogs);
  const currentDialog = useAppSelector(state => state.chat.currentDialog);

  const handleSendMessage = () => {
    if (!chatId) return;
    const dto: MessageDTO = { text: currentDialog?.inputMessage.text, attachments: currentDialog?.inputMessage.attachments }
    console.log(dto);
    
    ChatService.sendMessageToUser(dispatch, Number(chatId.split("=")[1]), dto);
  }

  React.useEffect(() => {
    if (!chatId) { return; }
    const id = Number(chatId.split("=")[1]);
    if (!id) { return; }

    const stringType = chatId.split("=")[0];
    let type: DialogTypes;
    if (stringType === "user") { type = DialogTypes.private; }
    else if (stringType === "group") { type = DialogTypes.group; }
    else { return; }

    const dialogFromStore = ChatService.findDialog(id, type, allDialogs);
    if (dialogFromStore) {
      dispatch(setCurrentDialog(dialogFromStore));
      return;
    }

    (async () => {
      let dialogFromApi;
      if (type === DialogTypes.private) {
        dialogFromApi = await ChatService.getPrivateDialogFromApi(id);
        if (dialogFromApi) { dialogFromApi = ChatService.processPrivateDialogDTO(dialogFromApi); }
      } else if (type === DialogTypes.group) {
        dialogFromApi = await ChatService.getGroupDialogFromApi(id);
        if (dialogFromApi) { dialogFromApi = ChatService.processGroupDialogDTO(dialogFromApi); }
      }
      if (dialogFromApi) {
        dispatch(setCurrentDialog(dialogFromApi));
        return;
      }
    })();

    const name: string = "ss";
    dispatch(setCurrentDialog({
      id: id,
      type: type,
      messages: [],
      inputMessage: { id: uuid(), text: "", attachments: [] },
      name: name,
      users: [],
      avatarUrl: undefined
    }));

  }, [chatId, allDialogs, dispatch]);

  return (
    <div className={styles.chat}>
      {currentDialog &&
        <>
          <MessageListContainer />
          <ChatInputContainer
            handleSubmit={handleSendMessage}
          />
        </>
      }
    </div>
  );
}

export default Chat;