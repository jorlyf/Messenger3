import * as React from "react";
import { useNavigate, useParams } from "react-router";
import useAppSelector from "../../hooks/useAppSelector";

import styles from "./Chat.module.css";

const Chat: React.FC = () => {
  const navigate = useNavigate();
  const { chatId } = useParams();

  const isAuthorized = useAppSelector(state => state.auth.isAuthorized);

  React.useEffect(() => {
    if (!isAuthorized) { navigate("/auth"); }
  }, [isAuthorized, navigate]);

  return (
    <div className={styles.chat}>
      {chatId}
    </div>
  );
}

export default Chat;