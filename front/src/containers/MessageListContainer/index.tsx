import * as React from "react";
import MessageList from "../../components/MessageList";
import Message from "../../entities/local/Message";

export interface MessageListContainerProps {
  messages: Message[];
}

const MessageListContainer: React.FC<MessageListContainerProps> = ({ messages }) => {
  return (
    <MessageList items={messages} />
  );
}

export default MessageListContainer;