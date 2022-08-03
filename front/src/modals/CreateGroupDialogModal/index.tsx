import * as React from "react";
import useCreateGroupDialogModal from "./useCreateGroupDialogModal";
import defaultAvatar from "../../../public/defaultAvatar.jpg";

import styles from "./CreateGroupDialogModal.module.css";
import { overlay } from "../overlay.module.css";
import UserSearchContainer from "../../containers/UserSearchContainer";

const CreateGroupDialogModal: React.FC = () => {

  const {
    open,
    users,
    handleAddUserId,
    handleRemoveUserId,
    handleClearUserIds,
    handleSubmitCreate
  } = useCreateGroupDialogModal();

  return (
    <>
      {open &&
        <div className={overlay}>
          <div className={styles.container}>
            <div className={styles.userList}>
              {users.map(x => (
                <div className={styles.userListItem}>
                  <div className={styles.userListItemAvatar}>
                    {x.avatarUrl ?
                      <img src={x.avatarUrl} />
                      :
                      <img src={defaultAvatar} />
                    }
                  </div>
                  <span className={styles.userListItemLogin}>{x.login}</span>
                </div>
              ))}
            </div>

            <div>
              <UserSearchContainer /> 
            </div>
          </div>
        </div>
      }
    </>
  );
}

export default CreateGroupDialogModal;