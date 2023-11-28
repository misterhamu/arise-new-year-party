"use client";
import Loading from "@components/loading";
import { ReactNode, createContext, useContext, useState } from "react";

type Props = {
  children: ReactNode;
};

type AppContextType = {
  show: () => void;
  hide: () => void;
};

const defaultState: AppContextType = {
  show: () => {},
  hide: () => {},
};

const LoadingContext = createContext(defaultState);

const LoadingProvider = ({ children }: Props) => {
  const [isShow, setIsShow] = useState(false);
  const handleShow = () => {
    setIsShow(true);
  };
  const handleHide = () => {
    setIsShow(false);
  };

  const values = {
    show: handleShow,
    hide: handleHide,
  };

  return (
    <LoadingContext.Provider value={values}>
      {children}
      {isShow && <Loading/>}
      </LoadingContext.Provider>
  );
};

export { LoadingContext, LoadingProvider };
export const useLoading = () => useContext(LoadingContext);
