"use client";
import React, { ComponentPropsWithoutRef, FC, useState } from "react";
import { MdOutlineCancel } from "react-icons/md";
import { IoSearch } from "react-icons/io5";
import classNames from "classnames";
import { useAppContext } from "./AppContext";

function debounce(func: any, timeout = 1900) {
  let timer: any;
  return () => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func();
    }, timeout);
  };
}

interface SearchBarProps extends ComponentPropsWithoutRef<"input"> {}

const SearchBar: FC<SearchBarProps> = ({
  placeholder = "Search",
  className = "",
  ...rest
}) => {
  const { updateSearchValue } = useAppContext();
  const [value, setValue] = useState("");

  const debounceSearchValue = (value: string, delay?: number) => {
    if (delay) {
      debounce(updateSearchValue(value), delay);
      return;
    }
    debounce(updateSearchValue(value));
  };

  return (
    <div className="relative">
      <input
        {...rest}
        className={classNames("bg-slate-200 py-2 px-4 rounded-md", className)}
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
          debounceSearchValue(e.target.value);
        }}
        placeholder={placeholder}
      />
      {value ? (
        <MdOutlineCancel
          onClick={() => {
            setValue("");
            debounceSearchValue("", 0);
          }}
          className="absolute right-2 top-[50%] translate-y-[-50%]  cursor-pointer"
          size={"1.6rem"}
        />
      ) : (
        <IoSearch
          className="absolute right-2 top-[50%] translate-y-[-50%]"
          size={"1.6rem"}
        />
      )}
    </div>
  );
};

export default SearchBar;
