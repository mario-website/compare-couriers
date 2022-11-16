import {defaultData} from "../../utils/couriersFetchData.js";

export const INITIAL_STATE = {
  dataAllResponses: defaultData,
  filteredData: defaultData,
  defaultData,
};

export const allResReducer = (state, action) => {
  switch (action.type) {
    case ACTION_TYPES.SET_DATA_ALL_RESPONSES:
      return {
        ...state,
        dataAllResponses: action.payload,
      };
    case ACTION_TYPES.SET_DATA_ALL_RESPONSES_DEFAULT:
      return {
        ...state,
        dataAllResponses: defaultData,
      };
    case ACTION_TYPES.SET_FILTERED_DATA:
      return {
        ...state,
        filteredData: action.payload,
      };
    default:
      return state;
  }
};

const ACTION_TYPES = {
  SET_DATA_ALL_RESPONSES: "SET_DATA_ALL_RESPONSES",
  SET_DATA_ALL_RESPONSES_DEFAULT: "SET_DATA_ALL_RESPONSES_DEFAULT",
  SET_FILTERED_DATA: "SET_FILTERED_DATA",
};
