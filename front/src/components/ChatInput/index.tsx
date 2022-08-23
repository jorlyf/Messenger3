import * as React from "react";
import InputField from "../InputField";
import AttachIcon from "../../../public/icons/Attach.png";
import SendIcon from "../../../public/icons/Send.png";

import styles from "./ChatInput.module.css";
import MessageInputAttachment from "../../entities/local/MessageInputAttachment";

interface ChatInputProps {
  value: string;
  setValue: (newValue: string) => void;
  handleSubmit: () => void;
  handleAttach: () => void;
  handleDettach: (id: string) => void;
  attachments: MessageInputAttachment[];
}

const ChatInput: React.FC<ChatInputProps> = ({ value, setValue, handleSubmit, handleAttach, handleDettach, attachments }) => {
  return (
    <>
      <div className={styles.container}>
        <div className={styles.attachContainer}>
          <img onClick={handleAttach} src={AttachIcon} className={styles.attach} alt="Attach" />
          <span className={styles.attachCount}>{attachments.length || ""}</span>
        </div>

        <div className={styles.input}>
          <InputField
            value={value}
            setValue={setValue}
            placeholder={"Напишите сообщение..."}
            minRows={1}
            maxRows={4}
            handleEnter={handleSubmit}
          />
        </div>

        <img onClick={handleSubmit} src={SendIcon} className={styles.send} alt="Send" />
      </div>

      <div className={styles.attached}>
        {attachments.map(x => (
          <div key={x.id}>
            <span onClick={() => handleDettach(x.id)} className={styles.detach}>X</span>
            <span>{x.file.name}</span>
          </div>
        ))}
      </div>
    </>
  );
}

export default ChatInput;