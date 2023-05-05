// src/contexts/CourierContext/CourierProvider.tsx
import React, {useState, ReactNode} from "react";
import {CourierContext} from "./CourierContext";

interface ICourierProviderProps {
  children: ReactNode;
}

const CourierProvider: React.FC<ICourierProviderProps> = ({children}) => {
  const [couriers, setCouriers] = useState<any[]>([]);
  const [isSearchingTxt, setIsSearchingTxt] = useState<string>("");

  return (
    <CourierContext.Provider
      value={{couriers, setCouriers, isSearchingTxt, setIsSearchingTxt}}>
      {children}
    </CourierContext.Provider>
  );
};

export default CourierProvider;
