import React, {useContext} from "react";
import {InputFormContext} from "../../contexts/InputFormContext";
import "./style.scss";

import {DefaultValues, InputFormProps} from "./types";

const InputForm = ({
  labelName,
  placeholder,
  name,
  useReducerTable,
  units,
}: InputFormProps) => {
  const {inputFormDispatch, inputFormState} = useContext(InputFormContext);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    inputFormDispatch({
      type: "CHANGE_INPUT",
      payload: {name, value: e.target.value},
    });
  };

  const currentValue = inputFormState[name as keyof DefaultValues];
  const isZeroNumber: boolean = currentValue === 0;

  const withDimensions = (
    <p>
      <input
        type={isZeroNumber ? "text" : "number"}
        step={0.1}
        min={1}
        max={1000}
        onChange={(e) => handleChange(e)}
        value={isZeroNumber ? "" : Number(currentValue)}
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
