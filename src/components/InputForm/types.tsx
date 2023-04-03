import {DefaultValues, Dimensions} from "../../types";
export type {DefaultValues};

export interface InputFormProps {
  labelName: Dimensions["labelName"];
  placeholder: Dimensions["placeholder"];
  name: Dimensions["name"];
  useReducerTable: {
    stateCurrentValues: DefaultValues;
    dispatchUseReducer: React.Dispatch<{
      type: string;
      payload?: any;
    }>;
  };
  units: Dimensions["units"];
}
