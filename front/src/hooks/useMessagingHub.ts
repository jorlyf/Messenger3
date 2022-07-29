import * as React from "react";
import { BASE_URL, NodeEnv } from "../http";
import { HttpTransportType, HubConnection, HubConnectionBuilder, LogLevel } from "@microsoft/signalr";
import { AppDispatch } from "../redux/store";
import useAppSelector from "./useAppSelector";
import { useDispatch } from "react-redux";

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

const setClientHandlers = (connection: HubConnection, dispatch: AppDispatch) => {
  connection.on(MessagingHubMethods.ReceiveNewMessage, (stringJsonMessage: string) => {
    const jsonMessage = JSON.parse(stringJsonMessage);

    console.log(jsonMessage);

  });
}

const useMessagingHub = () => {
  const dispatch = useDispatch();

  const isAuthorized = useAppSelector(state => state.auth.isAuthorized);
  const token = useAppSelector(state => state.auth.token);
  const ownerUser = useAppSelector(state => state.profile.user);

  React.useEffect(() => {
    if (!isAuthorized || !token || !ownerUser || !dispatch) return;

    const connection: HubConnection = buildHubConnection(token);
    setClientHandlers(connection, dispatch);
    
    connection.start();
    return () => {
      connection.stop();
    }

  }, [isAuthorized, ownerUser, dispatch]);
}

export default useMessagingHub;