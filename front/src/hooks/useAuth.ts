import * as React from "react";
import { useNavigate } from "react-router-dom";
import useAppSelector from "./useAppSelector";

const useAuth = () => {
  const navigate = useNavigate();
  const isAuthorized = useAppSelector(state => state.auth.isAuthorized);

  React.useEffect(() => {
    if (!isAuthorized) {
      navigate("/auth");
    }
  }, [navigate, isAuthorized]);
}
 
export default useAuth;