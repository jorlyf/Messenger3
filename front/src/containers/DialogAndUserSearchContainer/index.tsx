import * as React from 'react';
import Search from '../../components/Search';

interface IDialogAndUserSearchContainerProps {

}

const DialogAndUserSearchContainer: React.FC<IDialogAndUserSearchContainerProps> = () => {
  const [inputValue, setInputValue] = React.useState<string>("");

  const handleChangeValue = (newValue: string) => {
    setInputValue(newValue);

    
  }

  return (
    <Search
      value={inputValue}
      setValue={handleChangeValue}
    />
  );
}

export default DialogAndUserSearchContainer;