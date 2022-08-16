import * as React from "react";
import { useNavigate } from "react-router-dom";
import useAppSelector from "./useAppSelector";

let url: string;
let urlGetted: boolean = false;
let firstNavigated: boolean = false;

const useAuth = () => {
  const navigate = useNavigate();
  const isAuthorized = useAppSelector(state => state.auth.isAuthorized);

  React.useEffect(() => {
    if (!urlGetted) {
      urlGetted = true;
      url = window.location.pathname;
    }

    if (!isAuthorized) {
      navigate("/auth");
    } else if (!firstNavigated) {
      firstNavigated = true;
      navigate(url);
    }
  }, [navigate, isAuthorized]);
}

export default useAuth;