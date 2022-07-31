import * as React from "react";
import MessageList from "../../components/MessageList";
import DialogModel from "../../entities/db/DialogModel";
import Message from "../../entities/local/Message";

export interface MessageListContainerProps {
  dialog: DialogModel;
  messages: Message[];
}

const MessageListContainer: React.FC<MessageListContainerProps> = ({ dialog, messages }) => {
  return (
    <MessageList
      dialogId={dialog.id}
      dialogType={dialog.type}
      items={messages}
    />
  );
}

export default MessageListContainer;