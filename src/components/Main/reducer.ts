import {
  defaultValues,
  couriersNamesArr,
  couriersData,
  defaultData,
  DefaultValues,
  ReturnCouriersData,
  CouriersNamesArr,
  DefaultData,
} from "../../utils/couriersFetchData";

export interface Initial_State {
  couriersData: (values: DefaultValues) => ReturnCouriersData;
  couriersNamesArr: CouriersNamesArr;
  currentValues: DefaultValues;
  fetchCounter: number;
  allRes: any[];
  valueClickedBtn: string;
  isClickedBtn: Boolean;
  tempController: null;
  defaultData: DefaultData;
  error: {message: string; stack: string};
}

export const INITIAL_STATE: Initial_State = {
  couriersData,
  couriersNamesArr,
  currentValues: defaultValues,
  fetchCounter: 0,
  allRes: [],
  valueClickedBtn: "",
  isClickedBtn: false,
  tempController: null,
  defaultData,
  error: {message: "", stack: ""},
};

export interface TableReducer {
  state: Initial_State;
  action: {type: string; payload?: any};
}

export const tableReducer = (state = INITIAL_STATE, action: TableReducer["action"]) => {
  switch (action.type) {
    case ACTION_TYPES.SET_TO_DEFAULT_FETCH_COUNTER:
      return {
        ...state,
        ...{fetchCounter: INITIAL_STATE.fetchCounter},
      };
    case ACTION_TYPES.SET_TO_DEFAULT_ALL_RES:
      return {
        ...state,
        ...{allRes: INITIAL_STATE.allRes},
      };
    case ACTION_TYPES.SET_ALL_RESPONSES:
      return {
        ...state,
        ...{allRes: [...state.allRes, ...action.payload]},
      };
    case ACTION_TYPES.CHANGE_INPUT:
      return {
        ...state,
        ...{
          currentValues: {
            ...state.currentValues,
            ...{
              [action.payload.name]: Number(action.payload.value),
            },
          },
        },
      };
    case ACTION_TYPES.INCREASE_FETCH_COUNTER_BY_1:
      return {
        ...state,
        ...{fetchCounter: state.fetchCounter + 1},
      };

    case ACTION_TYPES.SET_IS_CLICKED_BTN_TO_TRUE:
      return {
        ...state,
        isClickedBtn: true,
      };
    case ACTION_TYPES.SET_IS_CLICKED_BTN_TO_FALSE:
      return {
        ...state,
        isClickedBtn: false,
      };
    case ACTION_TYPES.SET_VALUE_CLICKED_BTN:
      return {
        ...state,
        valueClickedBtn: action.payload,
      };
    case ACTION_TYPES.SET_TEMP_CONTROLLER:
      return {
        ...state,
        tempController: action.payload,
      };
    default:
      return state;
  }
};

const ACTION_TYPES = {
  SET_TO_DEFAULT_FETCH_COUNTER: "SET_TO_DEFAULT_FETCH_COUNTER",
  SET_TO_DEFAULT_ALL_RES: "SET_TO_DEFAULT_ALL_RES",
  SET_ALL_RESPONSES: "SET_ALL_RESPONSES",
  INCREASE_FETCH_COUNTER_BY_1: "INCREASE_FETCH_COUNTER_BY_1",
  INCREASE_COUNTER_BY_1: "INCREASE_COUNTER_BY_1",
  SET_WEIGHT_VALUE: "SET_WEIGHT_VALUE",
  CHANGE_INPUT: "CHANGE_INPUT",
  SET_IS_CLICKED_BTN_TO_TRUE: "SET_IS_CLICKED_BTN_TO_TRUE",
  SET_IS_CLICKED_BTN_TO_FALSE: "SET_IS_CLICKED_BTN_TO_FALSE",
  SET_VALUE_CLICKED_BTN: "SET_VALUE_CLICKED_BTN",
  SET_TEMP_CONTROLLER: "SET_TEMP_CONTROLLER",
};
