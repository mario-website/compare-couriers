// src/contexts/InputFormContext/index.tsx
import React, {createContext, Dispatch, ReactNode, useReducer} from "react";

interface InputFormState {
  [key: string]: any;
}

interface InputFormAction {
  type: string;
  payload: {
    name: string;
    value: any;
  };
}

const initialState: InputFormState = {};

const inputFormReducer = (state: InputFormState, action: InputFormAction) => {
  switch (action.type) {
    case "CHANGE_INPUT":
      return {...state, [action.payload.name]: action.payload.value};
    default:
      return state;
  }
};

interface InputFormContextData {
  inputFormState: InputFormState;
  inputFormDispatch: Dispatch<InputFormAction>;
}

export const InputFormContext = createContext<InputFormContextData>({
  inputFormState: initialState,
  inputFormDispatch: () => {},
});

interface InputFormProviderProps {
  children: ReactNode;
}

const InputFormProvider: React.FC<InputFormProviderProps> = ({children}) => {
  const [inputFormState, inputFormDispatch] = useReducer(inputFormReducer, initialState);

  return (
    <InputFormContext.Provider value={{inputFormState, inputFormDispatch}}>
      {children}
    </InputFormContext.Provider>
  );
};

export default InputFormProvider;
