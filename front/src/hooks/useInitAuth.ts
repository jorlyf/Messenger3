import * as React from "react";
import { useDispatch } from "react-redux";
import useAppSelector from "./useAppSelector";
import { setInitAuthAttempt } from "../redux/slices/authSlice";
import AuthService from "../services/AuthService";

const useInitAuth = () => {
  const dispatch = useDispatch();

  const wasInitAuthAttempt = useAppSelector(state => state.auth.wasInitAuthAttempt);
  const isAuthorized = useAppSelector(state => state.auth.isAuthorized);
  const isLogging = useAppSelector(state => state.auth.isLogging);

  React.useEffect(() => {
    if (wasInitAuthAttempt || isAuthorized || isLogging) return;

    const token = localStorage.getItem("token");
    if (!token) {
      dispatch(setInitAuthAttempt(true));
      return;
    }

    AuthService.loginByToken(dispatch);
  }, [dispatch, wasInitAuthAttempt, isAuthorized, isLogging]);
}

export default useInitAuth;