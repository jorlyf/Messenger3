import * as React from "react";
import { useNavigate } from "react-router";

import styles from "./NotFound.module.css";

const NotFound: React.FC = () => {
  const navigate = useNavigate();

  React.useEffect(() => {
    setTimeout(() => navigate("/"), 2000);
  }, [navigate]);

  return (
    <div>
      <div className={styles.container}>
        <h1>Страница не найдена!</h1>
        <p>Вы будете перенаправлены...</p>
      </div>
    </div>
  );
}

export default NotFound;