import * as React from "react";
import useProfilePage from "./useProfilePage";
import defaultAvatar from "../../../public/defaultAvatar.jpg";

import styles from "./Profile.module.css";
import { getUserDataUrl } from "../../utils";

const Profile: React.FC = () => {
  const { login, avatarUrl, handleUploadAvatar } = useProfilePage();
  return (
    <div className={styles.profile}>
      <div className={styles.container}>
        <div className={styles.avatarContainer}>
          <span className={styles.login}>{login}</span>
          {avatarUrl ?
            <img className={styles.avatar} src={getUserDataUrl(avatarUrl)} />
            :
            <img className={styles.avatar} src={defaultAvatar} />
          }
          <button className={styles.uploadAvatarButton} onClick={handleUploadAvatar}>Загрузить аватар</button>
        </div>
      </div>
    </div>
  );
}

export default Profile;