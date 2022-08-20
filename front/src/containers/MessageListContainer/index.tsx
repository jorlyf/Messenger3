import * as React from "react";
import { useDispatch } from "react-redux";
import { addDialogMessages } from "../../redux/slices/chatSlice";
import useAppSelector from "../../hooks/useAppSelector";
import MessageService from "../../services/MessageService";
import MessageList from "../../components/MessageList";
import Dialog from "../../entities/local/Dialog";

export interface MessageListContainerProps {
  dialog: Dialog;
}

const MessageListContainer: React.FC<MessageListContainerProps> = ({ dialog }) => {
  const dispatch = useDispatch();

  const dialogs = useAppSelector(state => state.chat.dialogs);

  const [getOldestMessagesAvailable, setGetOldestMessagesAvailable] = React.useState<boolean>(true);

  const getOldestMessages = async () => {
    if (!getOldestMessagesAvailable) return;
    setGetOldestMessagesAvailable(false);

    const newMessages = await MessageService.getOldestMessages(dialogs, dialog.id, dialog.type);
    dispatch(addDialogMessages({ dialogId: dialog.id, dialogType: dialog.type, messages: newMessages }));

    setTimeout(() => {
      setGetOldestMessagesAvailable(true);
    }, 100);
  }

  const items = React.useMemo(() => {
    const messages = dialog.messages.slice().sort((x, y) => x.sentAtTotalMilliseconds - y.sentAtTotalMilliseconds);
    return messages;
  }, [dialog]);

  return (
    <MessageList
      dialogId={dialog.id}
      dialogType={dialog.type}
      items={items}
      loadMoreItems={getOldestMessages}
      loadItemsAvailable={getOldestMessagesAvailable}
    />
  );
}

export default MessageListContainer;