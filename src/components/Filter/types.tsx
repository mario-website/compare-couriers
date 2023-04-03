import {DefaultData} from "../../types";

export interface FilterProps {
  setSorting: (item: string) => void;
  fetchCounter: number;
  currentSortingValues: {sortedBy: string; isAscending: boolean; deliveryTimeBtn: string};
  screenSize: string;
  workingData: DefaultData;
  handleDeliveryTime: (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    deliveryTimeBtn: string
  ) => void;
  delTime: (time: string) => string | undefined;
}
