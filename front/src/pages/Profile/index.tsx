import * as React from "react";
import useProfilePage from "./useProfilePage";

import styles from "./Profile.module.css";

const Profile: React.FC = () => {
  const { login, avatarUrl, handleChangeAvatar } = useProfilePage();
  return (
    <div className={styles.profile}>
      <div className={styles.container}>
        <div className={styles.avatarContainer}>
          <span className={styles.login}>{login}</span>
          <img className={styles.avatar} src={avatarUrl || undefined} />
          <button className={styles.uploadAvatarButton} onClick={handleChangeAvatar}>Загрузить аватар</button>
        </div>
      </div>
    </div>
  );
}

export default Profile;