import {DefaultData} from "../utils";

export interface Initial_State {
  dataAllResponses: DefaultData;
  filteredData: DefaultData;
  defaultData: DefaultData;
}

export interface AllResReducer {
  state: Initial_State;
  action: {type: string; payload?: any};
}
