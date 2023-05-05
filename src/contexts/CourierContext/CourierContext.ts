// src/contexts/CourierContext/CourierContext.tsx
import {createContext} from "react";

export interface ICourierContext {
  couriers: any[];
  setCouriers: (couriers: any[]) => void;
  isSearchingTxt: string;
  setIsSearchingTxt: (isSearchingTxt: string) => void;
}

export const CourierContext = createContext<ICourierContext>({
  couriers: [],
  setCouriers: () => {},
  isSearchingTxt: "please wait...",
  setIsSearchingTxt: () => {},
});
