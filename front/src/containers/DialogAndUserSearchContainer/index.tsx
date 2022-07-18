import * as React from 'react';
import Search from '../../components/Search';
import useDebounce from '../../hooks/useDebounce';
import ChatService from '../../services/ChatService';

const DialogAndUserSearchContainer: React.FC = () => {
  const [inputValue, setInputValue] = React.useState<string>("");

  const search = useDebounce(async (value: string) => {
    if (!value) return;
    
    const usersPromise = ChatService.searchUsersByLoginContains(value);
    const dialogsPromise = ChatService.searchDialogsByNameContains(value);

    const [dialogs, users] = await Promise.all([usersPromise, dialogsPromise]);
    console.log(users);
    console.log(dialogs);
  }, 250);

  const handleChangeValue = (newValue: string) => {
    setInputValue(newValue);
    search(newValue);
  }

  return (
    <Search
      value={inputValue}
      setValue={handleChangeValue}
    />
  );
}

export default DialogAndUserSearchContainer;