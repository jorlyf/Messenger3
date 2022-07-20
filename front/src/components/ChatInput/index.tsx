import * as React from "react";
import InputField from "../InputField";
import AttachIcon from "../../../public/icons/Attach.png";
import SendIcon from "../../../public/icons/Send.png";

import styles from "./ChatInput.module.css";

interface ChatInputProps {
  value: string;
  setValue: (newValue: string) => void;
}

const ChatInput: React.FC<ChatInputProps> = ({ value, setValue }) => {
  return (
    <div className={styles.container}>
      <img src={AttachIcon} className={styles.attach} alt="Attach" />

      <div className={styles.input}>
        <InputField
          value={value}
          setValue={setValue}
          placeholder={"Напишите сообщение..."}
          minRows={1}
          maxRows={4}
        />
      </div>

      <img src={SendIcon} className={styles.send} alt="Send" />
    </div>
  );
}

export default ChatInput;