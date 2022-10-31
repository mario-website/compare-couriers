import React, {useReducer, useEffect} from "react";

const InputForm = ({labelName, placeholder, name, useReducerTable}) => {
  const handleChange = (e) => {
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
          onChange={handleChange}
          placeholder={placeholder}
          value={useReducerTable.stateCurrentValues[name]}
        />
      </label>
    </div>
  );
};

export default InputForm;
