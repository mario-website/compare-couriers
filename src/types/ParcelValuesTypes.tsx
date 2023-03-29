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

export interface Dimensions {
  name: string;
  labelName: string;
  placeholder: string;
  units: string;
}
