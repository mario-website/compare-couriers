import {DefaultData, SingleFormatedItem} from "../../types";

export type {DefaultData};

export interface AllResultsProps {
  allResponses: SingleFormatedItem[];
  fetchCounter: number;
  isSearching: boolean;
  setIsSearching: React.Dispatch<React.SetStateAction<boolean>>;
  controller: AbortController;
}
