import * as React from "react";
import { getUserDataUrl } from "../../utils";
import useProfilePage from "./useProfilePage";
import defaultAvatar from "../../../public/DefaultAvatar.jpg";

import styles from "./Profile.module.css";

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