import {ACTION_TYPES} from "./postActionTypes";
import couriers from "./couriers";

export const INITIAL_STATE = {
  loading: false,
  post: {},
  error: false,
  forFetchingData: couriers.forFetchingData,
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
