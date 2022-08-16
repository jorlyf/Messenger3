import * as React from "react";
import { BASE_URL, NodeEnv } from "../http";
import { useDispatch } from "react-redux";
import { HttpTransportType, HubConnection, HubConnectionBuilder, LogLevel } from "@microsoft/signalr";
import useAppSelector from "./useAppSelector";
import { AppDispatch } from "../redux/store";
import MessageService from "../services/MessageService";
import NewMessageDTO from "../entities/dtos/NewMessageDTO";
import DialogModel, { DialogTypes } from "../entities/db/DialogModel";

export enum MessagingHubMethods {
  ReceiveNewMessage = "ReceiveNewMessage"
}

const getLogger = () => {
  if (process.env.NODE_ENV === NodeEnv.production) return LogLevel.None;
  return LogLevel.Debug;
}

const buildHubConnection = (token: string): HubConnection => {
  const connection: HubConnection = new HubConnectionBuilder()
    .withUrl(`${BASE_URL}/hubs/MessagingHub`,
      {
        logger: getLogger(),
        skipNegotiation: true,
        transport: HttpTransportType.WebSockets,
        accessTokenFactory: (): string => token
      })
    .withAutomaticReconnect()
    .build();

  return connection;
}

const setClientHandlers = (connection: HubConnection, dispatch: AppDispatch, allDialogsRef: React.RefObject<DialogModel[]>) => {
  connection.on(MessagingHubMethods.ReceiveNewMessage, (newMessageDTO: NewMessageDTO) => {
    switch (newMessageDTO.dialogType) { // convert backend int enum to string enum
      case 0:
        newMessageDTO.dialogType = DialogTypes.private;
        break;
      case 1:
        newMessageDTO.dialogType = DialogTypes.group;
        break;

      default:
        return;
    }
    if (!allDialogsRef.current) { throw new Error("allDialogsRef.current is null"); }
    MessageService.handleNewMessage(dispatch, newMessageDTO, allDialogsRef.current);
  });
}

const useMessagingHub = () => {
  const dispatch = useDispatch();

  const isAuthorized = useAppSelector(state => state.auth.isAuthorized);
  const token = useAppSelector(state => state.auth.token);
  const ownerUser = useAppSelector(state => state.profile.user);
  const allDialogs = useAppSelector(state => state.chat.dialogs);

  const connectionRef = React.useRef<HubConnection | null>(null);
  const allDialogsRef = React.useRef<DialogModel[]>([]);

  React.useEffect(() => {
    if (!isAuthorized || !token || !ownerUser || !dispatch || connectionRef.current) return;

    const connection: HubConnection = buildHubConnection(token);
    setClientHandlers(connection, dispatch, allDialogsRef);

    connectionRef.current = connection;

    connection.start();
    return () => {
      connection.stop();
    }

  }, [isAuthorized, ownerUser, dispatch]);

  React.useEffect(() => {
    allDialogsRef.current = allDialogs;
  }, [allDialogs]);
}

export default useMessagingHub;