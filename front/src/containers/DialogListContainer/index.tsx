import * as React from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import useAppSelector from "../../hooks/useAppSelector";
import DialogService from "../../services/DialogService";
import DialogList from "../../components/DialogList";
import { DialogItem } from "../../components/DialogListItem";
import Message from "../../entities/local/Message";
import Dialog, { DialogTypes } from "../../entities/local/Dialog";

const DialogListContainer: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const isAuthorized = useAppSelector(state => state.auth.isAuthorized);
  const ownerUser = useAppSelector(state => state.profile.user);

  const dialogs = useAppSelector(state => state.chat.dialogs);
  const dialogsFetched = useAppSelector(state => state.chat.dialogsFetched);
  const currentDialogInfo = useAppSelector(state => state.chat.currentDialogInfo);
  const totalDialogCount = useAppSelector(state => state.chat.totalDialogCount);

  const [fetchDialogsAvailable, setFetchDialogsAvailable] = React.useState<boolean>(true);

  const getLastMessage = (messages: Message[]): Message | null => {
    if (messages.length === 0) return null;
    const msg = messages.reduce((x, y) => (x.sentAtTotalMilliseconds > y.sentAtTotalMilliseconds) ? x : y);
    return msg ? msg : null;
  }

  const getDialogNavigateUrl = (d: Dialog) => {
    let prefix: string;
    if (d.type === DialogTypes.private)
      prefix = "user";
    else
      prefix = "group";

    return `/${prefix}=${d.id}`;
  }

  const loadMoreDialogs = async () => {
    if (!fetchDialogsAvailable) return;
    if (!dialogsFetched) return;   

    setFetchDialogsAvailable(false);
    await DialogService.getMoreDialogs(dispatch, dialogs, totalDialogCount);
    
    setTimeout(() => {
      setFetchDialogsAvailable(true);
    }, 200);
  }

  const items: DialogItem[] = React.useMemo(() => {
    return dialogs.map(d => {
      const lastMsg = getLastMessage(d.messages);
      const isCurrentDialog = d.id === currentDialogInfo?.id && d.type === currentDialogInfo.type;
      return {
        id: d.id,
        type: d.type,
        isCurrentDialog: isCurrentDialog,
        onClick: () => { navigate(getDialogNavigateUrl(d)) },
        name: d.name,
        avatarUrl: d.avatarUrl,
        lastMessageText: lastMsg?.text,
        isLastMessageMy: lastMsg?.senderUser.id === ownerUser?.id,
        lastUpdateTotalMilliseconds: d.lastUpdateTotalMilliseconds
      }
    }).sort((x, y) => y.lastUpdateTotalMilliseconds - x.lastUpdateTotalMilliseconds);
  }, [dialogs, currentDialogInfo, navigate]);

  React.useEffect(() => {
    if (!isAuthorized || !ownerUser || dialogsFetched) return;

    DialogService.fisrtLoadDialogs(dispatch);

  }, [isAuthorized, ownerUser, dialogsFetched]);

  return (
    <DialogList
      items={items}
      loadMoreItems={loadMoreDialogs}
    />
  );
}

export default DialogListContainer;