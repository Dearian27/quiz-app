import React from "react";
import SearchBar from "./SearchBar";
import { MdAdd, MdOutlineAddBox } from "react-icons/md";

const Header = () => {
  return (
    <header className="w-[100%] py-6 bg-white flex items-center justify-center">
      <div className="w-[1200px] flex justify-between items-center">
        <h1 className="text-3xl font-mono text-[#4c4cff]">NextQuiz</h1>
        <SearchBar />
        <button className="flex items-center text-white bg-[#4c4cff] py-2 px-4 font-bold rounded-md">
          <MdAdd color="white" size="1.6rem" />
          Створити
        </button>
      </div>
    </header>
  );
};

export default Header;
