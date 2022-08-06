import * as React from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import useAppSelector from "../../hooks/useAppSelector";
import ChatService from "../../services/ChatService";
import DialogList from "../../components/DialogList";
import { DialogListItemProps } from "../../components/DialogListItem";
import Message from "../../entities/local/Message";
import DialogModel from "../../entities/db/DialogModel";

const DialogListContainer: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const isAuthorized = useAppSelector(state => state.auth.isAuthorized);
  const ownerUser = useAppSelector(state => state.profile.user);
  
  const dialogs = useAppSelector(state => state.chat.dialogs);
  const dialogsFetched = useAppSelector(state => state.chat.dialogsFetched);

  const getLastMessage = (messages: Message[]): Message | undefined => {
    if (messages.length === 0) return undefined;
    return messages.reduce((x, y) => (x.timeMilliseconds > y.timeMilliseconds) ? x : y);
  }

  const getDialogNavigateUrl = (d: DialogModel) => {
    let prefix: string = "";
    switch (d.type) {
      case 0:
        prefix = "user"
        break;
      case 1:
        prefix = "group"
        break;
    }
    return `/${prefix}=${d.id}`;
  }

  const items: DialogListItemProps[] = React.useMemo(() => {
    return dialogs.map(d => {
      const lastMsg = getLastMessage(d.messages);
      return {
        id: d.id,
        type: d.type,
        onClick: () => { navigate(getDialogNavigateUrl(d)) },
        name: d.name,
        avatarUrl: d.avatarUrl,
        lastMessageText: lastMsg?.text,
        isLastMessageMy: lastMsg?.senderUser.id === ownerUser?.id
      }
    });
  }, [dialogs, navigate]);

  React.useEffect(() => {
    if (!isAuthorized || !ownerUser || dialogsFetched) return;

    ChatService.loadDialogs(dispatch);

  }, [isAuthorized, ownerUser, dialogsFetched]);

  return (
    <DialogList items={items} />
  );
}

export default DialogListContainer;