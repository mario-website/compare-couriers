import {defaultData} from "utils";
import {Initial_State, AllResReducer} from "types";

export const INITIAL_STATE: Initial_State = {
  dataAllResponses: defaultData,
  filteredData: defaultData,
  defaultData,
};

export const allResReducer = (
  INITIAL_STATE: Initial_State,
  action: AllResReducer["action"]
) => {
  switch (action.type) {
    case ACTION_TYPES.SET_DATA_ALL_RESPONSES:
      return {
        ...INITIAL_STATE,
        dataAllResponses: action.payload,
      };
    case ACTION_TYPES.SET_DATA_ALL_RESPONSES_DEFAULT:
      return {
        ...INITIAL_STATE,
        dataAllResponses: defaultData,
      };
    case ACTION_TYPES.SET_FILTERED_DATA:
      return {
        ...INITIAL_STATE,
        filteredData: action.payload,
      };
    default:
      return INITIAL_STATE;
  }
};

const ACTION_TYPES = {
  SET_DATA_ALL_RESPONSES: "SET_DATA_ALL_RESPONSES",
  SET_DATA_ALL_RESPONSES_DEFAULT: "SET_DATA_ALL_RESPONSES_DEFAULT",
  SET_FILTERED_DATA: "SET_FILTERED_DATA",
};
