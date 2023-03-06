import React, {useReducer, useEffect} from "react";
import "./style.scss";

interface Dispatch {
  type: string;
  payload: {
    name: string;
    value: string | number;
  };
}

const InputForm = ({
  labelName,
  placeholder,
  name,
  useReducerTable,
  units,
}: {
  labelName: string;
  placeholder: string;
  name: string;
  useReducerTable: {
    dispatch: ({type, payload}: Dispatch) => void;
    stateCurrentValues: {[key: string]: any};
  };
  units: string;
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    useReducerTable.dispatch({
      type: "CHANGE_INPUT",
      payload: {name, value: e.target.value},
    });
  };
  const isZeroNumber: boolean =
    Number(useReducerTable.stateCurrentValues[name]).toString() === "0" ? true : false;

  return (
    <div className="InputForm">
      <p>{labelName}</p>
      {placeholder === "without dimensions" ? (
        <p>{name}</p>
      ) : (
        <p>
          <input
            type={isZeroNumber ? "text" : "number"}
            step={0.1}
            min={1}
            max={500}
            onChange={(e) => handleChange(e)}
            value={isZeroNumber ? " " : useReducerTable.stateCurrentValues[name]}
          />
          <label className="InputForm-Label">{units}</label>
        </p>
      )}
    </div>
  );
};

export default InputForm;
