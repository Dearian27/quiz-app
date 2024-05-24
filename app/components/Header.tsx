import React from "react";
import SearchBar from "./SearchBar";
import { MdAdd } from "react-icons/md";
import classNames from "classnames";
import Link from "next/link";

const Header = ({
  absolute = false,
  type = "default",
}: {
  absolute?: boolean;
  type?: "default" | "edit";
}) => {
  return (
    <div>
      <header
        className={classNames(
          "w-[100%] py-6 bg-white flex items-center justify-center",
          absolute ? "fixed" : ""
        )}
      >
        <div className="w-[1200px] flex justify-between items-center">
          <Link href={"/"} className="text-3xl font-mono text-[#4c4cff]">
            NextQuiz
          </Link>
          {type === "default" && (
            <>
              <SearchBar />
              <Link href="/editor">
                <button className="flex items-center text-white bg-[#4c4cff] py-2 px-4 font-bold rounded-md">
                  <MdAdd color="white" size="1.6rem" />
                  Створити
                </button>
              </Link>
            </>
          )}
        </div>
      </header>
    </div>
  );
};

export default Header;
