import * as React from "react";

import styles from "./CreateGroupDialogButton.module.css";

interface CreateGroupDialogButtonProps {
  handleOpen: () => void;
}

const CreateGroupDialogButton: React.FC<CreateGroupDialogButtonProps> = ({ handleOpen }) => {
  return (
    <div className={styles.container}>
      <button onClick={handleOpen} className={styles.button}>Создать групповой чат</button>
    </div>
  );
}

export default CreateGroupDialogButton;