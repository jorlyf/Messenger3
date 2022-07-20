import * as React from 'react';
import useDebounce from '../../hooks/useDebounce';
import useAppSelector from '../../hooks/useAppSelector';
import ChatService from '../../services/ChatService';
import Search from '../../components/Search';
import DialogAndUserSearchResult from '../../components/DialogAndUserSearchResult';
import Dialog from '../../models/DialogModel';
import UserModel from '../../models/UserModel';

export interface DialogAndUserSearchResultItems {
  users: UserModel[];
  dialogs: Dialog[];
}

const DialogAndUserSearchContainer: React.FC = () => {
  const ownerId = useAppSelector(state => state.profile.id);

  const [inputValue, setInputValue] = React.useState<string>("");
  const [isInputFocus, setIsInputFocus] = React.useState<boolean>(false);
  const [isActive, setIsActive] = React.useState<boolean>(false);

  const [searchResult, setSearchResult] = React.useState<DialogAndUserSearchResultItems | null>(null);

  const search = useDebounce(async (value: string) => {
    const usersPromise = ChatService.searchUsersByLoginContains(value);
    const dialogsPromise = ChatService.searchDialogsByNameContains(value);

    let [users, dialogs] = await Promise.all([usersPromise, dialogsPromise]);
    users = users.filter(u => u.id !== ownerId);

    setSearchResult({ users, dialogs });
  }, 250);

  const handleChangeValue = (newValue: string) => {
    setInputValue(newValue);
    if (newValue) {
      setIsActive(true);
      search(newValue);
    }
    else {
      setIsActive(false);
      setSearchResult(null);
    }
  };

  const handleOutsideClick = () => {
    if (!isInputFocus) {
      setIsActive(false);
    }
  };

  React.useEffect(() => {
    if (isInputFocus) {
      setIsActive(true);
    }
  }, [isInputFocus]);

  return (
    <>
      <Search
        value={inputValue}
        setValue={handleChangeValue}
        isFocus={isInputFocus}
        setIsFocus={setIsInputFocus}
      />
      {isActive && searchResult &&
        <>
          <DialogAndUserSearchResult
            items={searchResult}
            handleOutsideClick={handleOutsideClick}
          />
        </>
      }
    </>
  );
}

export default React.memo(DialogAndUserSearchContainer);