"use client";
import { useContext, createContext } from "react";

interface AppContextParams {
  search: string;
  updateSearchValue: (value: string) => void;
}

export const AppContext = createContext<AppContextParams>(null!);

export const useAppContext = () => {
  const props = useContext(AppContext);
  if (!props) {
    throw new Error("No AppContext provided");
  }
  return props;
};
