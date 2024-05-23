"use client";
import React, { ComponentPropsWithoutRef, FC, useState } from "react";
import { MdOutlineCancel } from "react-icons/md";
import { IoSearch } from "react-icons/io5";
import classNames from "classnames";

interface SearchBarProps extends ComponentPropsWithoutRef<"input"> {}

const SearchBar: FC<SearchBarProps> = ({
  placeholder = "Search",
  className = "",
  ...rest
}) => {
  const [value, setValue] = useState("");

  return (
    <div className="relative">
      <input
        {...rest}
        className={classNames("bg-slate-200 py-2 px-4 rounded-md", className)}
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
        }}
        placeholder={placeholder}
      />
      {value ? (
        <MdOutlineCancel
          className="absolute right-2 top-[50%] translate-y-[-50%]"
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
