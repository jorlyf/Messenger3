import * as React from 'react';
import useDebounce from '../../hooks/useDebounce';
import useAppSelector from '../../hooks/useAppSelector';
import ChatService from '../../services/ChatService';
import UserModel from '../../entities/db/UserModel';
import Search from '../../components/Search';
import UserSearchResult from '../../components/UserSearchResult';
import { useNavigate } from 'react-router-dom';

const UserSearchContainer: React.FC = () => {
  const navigate = useNavigate();

  const ownerUser = useAppSelector(state => state.profile.user);

  const [inputValue, setInputValue] = React.useState<string>("");
  const [isInputFocus, setIsInputFocus] = React.useState<boolean>(false);
  const [isActive, setIsActive] = React.useState<boolean>(false);

  const [searchResult, setSearchResult] = React.useState<UserModel[]>([]);

  const search = useDebounce(async (value: string) => {
    if (!ownerUser) return;
    let users = await ChatService.searchUsersByLoginContains(value);
    users = users.filter(u => u.id !== ownerUser.id);

    setSearchResult(users);
  }, 250);

  const handleChangeValue = (newValue: string) => {
    setInputValue(newValue);
    if (newValue) {
      setIsActive(true);
      search(newValue);
    }
    else {
      setIsActive(false);
      setSearchResult([]);
    }
  }

  const handleOutsideClick = () => {
    if (!isInputFocus) {
      setIsActive(false);
    }
  }

  const clear = () => {
    setSearchResult([]);
    setInputValue("");
    setIsActive(false);
  }

  const handleUserItemClick = (userId: number) => {
    navigate(`/user=${userId}`);
    clear();
  }

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
        disabled={!ownerUser}
      />
      {isActive && searchResult &&
        <>
          <UserSearchResult
            items={searchResult}
            handleUserItemClick={handleUserItemClick}
            handleOutsideClick={handleOutsideClick}
          />
        </>
      }
    </>
  );
}

export default React.memo(UserSearchContainer);