import {DefaultValues, Dimensions} from "../../types";
export type {Dimensions};

export interface DispatchParcelValues {
  type: string;
  payload: {
    name: string;
    value: string | number;
  };
}

export interface ClassNames {
  showAllDimensionsAndWeight: string;
  displayNone: string;
  displayGrid: string;
  removeGap: string;
}

export interface ParcelValuesProps {
  useReducerTable: {
    stateCurrentValues: DefaultValues;
    dispatchUseReducer: React.Dispatch<{
      type: string;
      payload?: any;
    }>;
  };
  setNewData: (e: {preventDefault: () => void}) => void;
}
