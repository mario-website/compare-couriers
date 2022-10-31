import {defaultValues} from "./couriers.js";
const {IS_ASCENDING, SORTED_BY} = defaultValues;

const defaultData = {
  options: {
    sortedBy: SORTED_BY,
    isAscending: IS_ASCENDING,
  },
  data: [],
};

export const INITIAL_STATE = {
  dataAllResponses: defaultData,
  newFilteredData: defaultData,
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
    case ACTION_TYPES.SET_NEW_FILTERED_DATA:
      return {
        ...state,
        newFilteredData: action.payload,
      };
    default:
      return state;
  }
};

const ACTION_TYPES = {
  SET_DATA_ALL_RESPONSES: "SET_DATA_ALL_RESPONSES",
  SET_DATA_ALL_RESPONSES_DEFAULT: "SET_DATA_ALL_RESPONSES_DEFAULT",
  SET_NEW_FILTERED_DATA: "SET_NEW_FILTERED_DATA",
};
