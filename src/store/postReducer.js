import {ACTION_TYPES} from "./postActionTypes.js";
import {defaultValues, couriersNamesArr, forFetchingData} from "./couriers.js";

export const INITIAL_STATE = {
  loading: false,
  post: {},
  error: false,
  forFetchingData,
  couriersNamesArr,
  currentValues: defaultValues,
  fetchCounter: 0,
};

export const postReducer = (state, action) => {
  switch (action.type) {
    case ACTION_TYPES.FETCH_START:
      return {
        loading: true,
        error: false,
        post: {},
      };
    case ACTION_TYPES.FETCH_SUCCESS:
      return {
        ...state,
        loading: false,
        post: action.payload,
      };
    case ACTION_TYPES.SET_TO_ZERO_FETCH_COUNTER:
      return {
        ...state,
        fetchCounter: 0,
      };
    case ACTION_TYPES.CHANGE_INPUT:
      return {
        ...state,
        ...{
          currentValues: {
            ...{
              [action.payload.name]: Number(action.payload.value),
            },
          },
        },
      };
    case ACTION_TYPES.INCREASE_FETCH_COUNTER:
      return {
        ...state,
        fetchCounter: state.fetchCounter + 1,
      };
    case ACTION_TYPES.FETCH_ERROR:
      return {
        error: action.payload,
        loading: false,
        post: {},
      };
    default:
      return state;
  }
};
