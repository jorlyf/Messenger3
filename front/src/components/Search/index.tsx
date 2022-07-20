import * as React from "react";
import InputField from "../InputField";
import SearchIcon from "../../../public/icons/Search.png";

import styles from "./Search.module.css";

interface SearchProps {
  value: string;
  setValue: (newValue: string) => void;
  isFocus: boolean;
  setIsFocus: (bool: boolean) => void;
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
          setIsFocus={props.setIsFocus}
        />
      </div>
    </div>
  );
}

export default Search;