import {createContext} from "react";

interface ICourierContext {
  couriers: any[];
  setCouriers: (couriers: any[]) => void;
  isSearchingTxt: string;
  setIsSearchingTxt: (isSearchingTxt: string) => void;
}

const CourierContext = createContext<ICourierContext>({
  couriers: [],
  setCouriers: () => {},
  isSearchingTxt: "please wait...",
  setIsSearchingTxt: () => {},
});

export default CourierContext;
