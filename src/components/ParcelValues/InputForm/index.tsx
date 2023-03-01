import React, {useReducer, useEffect} from "react";
import "./style.scss";

interface Dispatch {
  type: string;
  payload: {
    name: string;
    value: string | number;
  };
}

interface Props {
  labelName: string;
  placeholder: string;
  name: string;
  useReducerTable: {
    dispatch: ({type, payload}: Dispatch) => void;
    stateCurrentValues: {[key: string]: any};
  };
}
const InputForm = ({labelName, placeholder, name, useReducerTable}: Props) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    useReducerTable.dispatch({
      type: "CHANGE_INPUT",
      payload: {name, value: e.target.value},
    });
  };

  return (
    <div className="InputForm">
      <label className="InputForm-Label">
        <p>{labelName}</p>
        {placeholder === "none" ? (
          <p>{name}</p>
        ) : (
          <p>
            <input
              type="text"
              onChange={(e) => handleChange(e)}
              placeholder={placeholder}
              value={useReducerTable.stateCurrentValues[name]}
            />
          </p>
        )}
      </label>
    </div>
  );
};

export default InputForm;
