import * as React from "react";
import { useDispatch } from "react-redux";
import useAppSelector from "../../hooks/useAppSelector";
import ChatService from "../../services/ChatService";
import DialogList from "../../components/DialogList";
import { DialogListItemProps } from "../../components/DialogListItem";
import Message from "../../models/Message";
import { useNavigate } from "react-router-dom";

const DialogListContainer: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const isAuthorized = useAppSelector(state => state.auth.isAuthorized);
  const ownerUser = useAppSelector(state => state.profile.user);

  const dialogs = useAppSelector(state => state.chat.dialogs);
 
  const getLastMessage = (messages: Message[]): Message | undefined => {
    return messages.reduce((x, y) => (x.timeMilliseconds > y.timeMilliseconds) ? x : y);
  }

  const items: DialogListItemProps[] = React.useMemo(() => {
    return dialogs.map(d => {
      const lastMsg = getLastMessage(d.messages);
      return {
        id: d.id,
        type: d.type,
        onClick: () => { navigate(`/${d.type}=${d.id}`) },
        name: d.name,
        avatarUrl: d.avatarUrl,
        lastMessageText: lastMsg?.text,
        isLastMessageMy: lastMsg?.senderUser.id === ownerUser?.id
      }
    });
  }, [dialogs, navigate]);

  React.useEffect(() => {
    if (!isAuthorized || !ownerUser || dialogs.length > 0) return;

    ChatService.loadDialogs(dispatch);

  }, [isAuthorized, ownerUser]);

  return (
    <DialogList items={items} />
  );
}

export default DialogListContainer;