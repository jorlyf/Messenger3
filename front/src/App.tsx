import * as React from "react";
import { Route, Routes } from "react-router";
import useAppSelector from "./hooks/useAppSelector";
import useInitAuth from "./hooks/useInitAuth";
import useAuth from "./hooks/useAuth";
import useMessagingHub from "./hooks/useMessagingHub";
import DialogListContainer from "./containers/DialogListContainer";
import LeftColumnHeaderContainer from "./containers/LeftColumnHeaderContainer";
import RightColumnHeaderContainer from "./containers/RightColumnHeaderContainer";
import CreateGroupDialogButtonContainer from "./containers/CreateGroupDialogButtonContainer";
import Auth from "./pages/Auth";
import Chat from "./pages/Chat";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import Home from "./pages/Home";
import Modals from "./modals";

import styles from "./App.module.css";

const App: React.FC = () => {

  const wasInitAuthAttempt = useAppSelector(state => state.auth.wasInitAuthAttempt);

  useInitAuth();
  useAuth();
  useMessagingHub();

  return (
    <div className={styles.app}>
      <div className={styles.leftColumn}>
        <LeftColumnHeaderContainer />
        {wasInitAuthAttempt &&
          <>
            <DialogListContainer />
            <CreateGroupDialogButtonContainer />
          </>
        }
      </div>

      <div className={styles.rightColumn}>
        <RightColumnHeaderContainer />
        {wasInitAuthAttempt &&
          <Routes>
            <Route element={<Home />} path="/" />
            <Route element={<Chat />} path="/:chatId" />
            <Route element={<Auth />} path="/auth" />
            <Route element={<Profile />} path="/profile" />
            <Route element={<NotFound />} path="*" />
          </Routes>}
      </div>

      <Modals />
    </div>
  );
}

export default App;