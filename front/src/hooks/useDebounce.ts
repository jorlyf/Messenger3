import * as React from "react";

const useDebounce = (callback: (...args: any) => void, delay: number) => {
  const timeout = React.useRef<any>(null);

  const debouncedCallback = React.useCallback((...args: any) => {

    if (timeout.current) {
      clearTimeout(timeout.current);
    }

    timeout.current = setTimeout(() => callback(...args), delay);

  }, [callback, delay]);

  return debouncedCallback;
}

export default useDebounce;