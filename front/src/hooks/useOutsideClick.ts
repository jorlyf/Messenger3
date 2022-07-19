import * as React from "react";

const useOutsideClick = (callback: () => void, ref: any) => {
  React.useEffect(() => {
    const handleOutsideClick = (e: any) => {
      if (ref.current && !ref.current.contains(e.target)) {
        callback();
      }
    }

    document.addEventListener("click", handleOutsideClick);
    return () => document.removeEventListener("click", handleOutsideClick);

  }, [ref, callback]);
}

export default useOutsideClick;