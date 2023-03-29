import React from "react";
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
  const isZeroNumber: boolean = useReducerTable.stateCurrentValues[name] === 0;

  const withDimensions = (
    <p>
      <input
        type={isZeroNumber ? "text" : "number"}
        step={0.1}
        min={1}
        max={1000}
        onChange={(e) => handleChange(e)}
        value={isZeroNumber ? "" : useReducerTable.stateCurrentValues[name]}
      />
      <label className="InputForm-Label">{units}</label>
    </p>
  );

  return (
    <div className="InputForm">
      <p>{labelName}</p>
      {/* "without dimensions" is used to render this component to be used 
      as button to show all dimensions */}
      {placeholder === "without dimensions" ? <p>{name}</p> : withDimensions}
    </div>
  );
};

export default InputForm;
