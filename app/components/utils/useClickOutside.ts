import React, { RefObject } from "react";

export const useClickOutside = (
  ref: RefObject<HTMLElement>,
  callback: () => any
) => {
  const handleClick = (e: any) => {
    if (ref.current && !ref.current.contains(e?.target)) {
      callback();
    }
  };
  React.useEffect(() => {
    document.addEventListener("mousedown", handleClick);
    return () => {
      document.removeEventListener("mousedown", handleClick);
    };
  });
};
