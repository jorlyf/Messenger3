import * as React from "react";
import TextareaAutosize from "react-textarea-autosize";

interface InputFieldProps {
  value: string;
  setValue: (value: string) => void;
  placeholder?: string;
  handleEnter?: () => void;
  setIsFocus?: (bool: boolean) => void;
  minRows?: number;
  maxRows?: number;
  disabled?: boolean;
  isOneRow?: boolean;
}

const InputField: React.FC<InputFieldProps> = ({ value, setValue, placeholder, handleEnter, setIsFocus, minRows = 1, maxRows = 4, disabled = false, isOneRow = false }) => {

  const handleChangeValue = (e: any) => {
    setValue(e.target.value);
  }
  const handlePress = (e: any) => { // keyCode 13 - "Enter"
    if (isOneRow && e.keyCode === 13) { e.preventDefault(); } // no \n
    if (handleEnter && e.keyCode === 13 && !e.shiftKey) {
      e.preventDefault();
      handleEnter();
    }
  }
  const handleFocus = () => {
    if (setIsFocus) { setIsFocus(true); }
  }
  const handleUnfocus = () => {
    if (setIsFocus) { setIsFocus(false); }
    setValue(value.trim()); // trim
  }
  const getMaxRows = () => {
    if (isOneRow) return 1;
    if (maxRows) return maxRows;
  }

  return (
    <TextareaAutosize
      onKeyDown={handlePress}
      onChange={handleChangeValue}
      value={value}
      placeholder={placeholder}

      disabled={disabled}

      onFocus={handleFocus}
      onBlur={handleUnfocus}

      minRows={minRows}
      maxRows={getMaxRows()}
    />
  );
}

export default InputField;