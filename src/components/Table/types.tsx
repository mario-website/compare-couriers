import {DefaultData} from "../../types";
import {Initial_State_Main} from "../Main/helpers";

export interface TableProps {
  workingData: DefaultData;
  delTime: (argument: string) => string;
}

export interface TableReducer {
  state: Initial_State_Main;
  action: {type: string; payload?: any};
}
