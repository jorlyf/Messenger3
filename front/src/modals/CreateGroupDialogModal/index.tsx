import * as React from "react";
import useCreateGroupDialogModal from "./useCreateGroupDialogModal";
import UserSearchContainer from "../../containers/UserSearchContainer";
import defaultAvatar from "../../../public/DefaultAvatar.jpg";
import deleteIcon from "../../../public/icons/Delete.png";

import styles from "./CreateGroupDialogModal.module.css";
import { overlay } from "../overlay.module.css";

const CreateGroupDialogModal: React.FC = () => {
  const {
    open,
    users,
    handleAddUserId,
    handleRemoveUserId,
    handleClearUserIds,
    handleSubmitCreate,
    submitActive
  } = useCreateGroupDialogModal();

  return (
    <>
      {open &&
        <div className={overlay}>
          <div className={styles.modal}>

            <div className={styles.container}>
              <div className={styles.userList}>
                <h3 className={styles.userListHeader}>Список участников</h3>
                {users.map(x => (
                  <div key={x.id} className={styles.userListItem}>
                    <div className={styles.userListItemAvatarContainer}>
                      {x.avatarUrl ?
                        <img className={styles.userListItemAvatar} src={x.avatarUrl} />
                        :
                        <img className={styles.userListItemAvatar} src={defaultAvatar} />
                      }
                    </div>
                    <span className={styles.userListItemLogin}>{x.login}</span>
                    <img className={styles.userListItemDeleteButton} src={deleteIcon} onClick={() => handleRemoveUserId(x.id)} alt="remove" />
                  </div>
                ))}
              </div>

              <div className={styles.userSearch}>
                <UserSearchContainer
                  handleUserItemClick={handleAddUserId}
                  clearAfterUserItemClick={false}
                />
              </div>
            </div>

            <div className={styles.submitContainer}>
              <button className={styles.submitButton} onClick={handleSubmitCreate} disabled={!submitActive}>Создать</button>
            </div>

          </div>
        </div>
      }
    </>
  );
}

export default CreateGroupDialogModal;