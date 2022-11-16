import React, {useReducer, useEffect} from "react";

interface Dispatch {
  type: string,
  payload: {
    name: string,
    value: string | number
  }
}

interface Props {
  labelName: string,
  placeholder: string,
  name: string,
  useReducerTable: {
    dispatch: ({type, payload}: Dispatch) => void,
    stateCurrentValues: {[key: string]: any}
  } 
}
const InputForm : React.FC<Props> = ({labelName, placeholder, name, useReducerTable}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    useReducerTable.dispatch({
      type: "CHANGE_INPUT",
      payload: {name, value: e.target.value},
    });
  };

  return (
    <div
    // className={nameClass}
    >
      <label>
        {labelName}
        <input
          type="text"
          onChange={(e) =>handleChange(e)}
          placeholder={placeholder}
          value={useReducerTable.stateCurrentValues[name]}
        />
      </label>
    </div>
  );
};

export default InputForm;
