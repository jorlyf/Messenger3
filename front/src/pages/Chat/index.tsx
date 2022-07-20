import * as React from "react";
import { useNavigate, useParams } from "react-router";
import useAppSelector from "../../hooks/useAppSelector";
import MessageListContainer from "../../containers/MessageListContainer";

import styles from "./Chat.module.css";
import ChatInputContainer from "../../containers/ChatInputContainer";
import { useDispatch } from "react-redux";
import { setCurrentDialog } from "../../redux/slices/chatSlice";

const Chat: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { chatId } = useParams();

  const isAuthorized = useAppSelector(state => state.auth.isAuthorized);
  const dialogs = useAppSelector(state => state.chat.dialogs);
  const currentDialog = useAppSelector(state => state.chat.currentDialog);

  React.useEffect(() => {
    if (!isAuthorized) { navigate("/auth"); }
  }, [isAuthorized, navigate]);

  React.useEffect(() => {
    if (!chatId) return;
    const splitted = chatId.split("=");
    const type = splitted[0];
    const id = Number(splitted[1]);

    if (type === "user") {
      const dialog = dialogs.filter(d => d.id === id);
      // dispatch(setCurrentDialog());
    }
    if (type === "group") {

    }
  }, [chatId]);

  return (
    <div className={styles.chat}>
      <MessageListContainer />
      <ChatInputContainer />
    </div>
  );
}

export default Chat;