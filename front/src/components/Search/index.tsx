import * as React from "react";
import InputField from "../InputField";
import SearchIcon from "../../../public/icons/SearchIcon.png";

import styles from "./Search.module.css";

interface SearchProps {
  value: string;
  setValue: (newValue: string) => void;
}

const Search: React.FC<SearchProps> = (props) => {

  return (
    <div className={styles.search}>
      <img className={styles.icon} src={SearchIcon} alt="SearchIcon" />
      <div className={styles.input}>
        <InputField
          value={props.value}
          setValue={props.setValue}
          placeholder={"Поиск..."}
          isOneRow={true}
          maxRows={1}
        />
      </div>
    </div>
  );
}

export default Search;