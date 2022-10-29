import React, {useReducer} from "react";
import {INITIAL_STATE, postReducer} from "../../store/postReducer";

const InputForm = ({labelName, placeholder, name}) => {
  const [state, dispatch] = useReducer(postReducer, INITIAL_STATE);

  const handleChange = (e) => {
    dispatch({
      type: "CHANGE_INPUT",
      payload: {name, value: e.target.value},
    });
  };
  console.log(`state:`, state.currentValues[name]);
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
          value={state.currentValues[name]}
        />
      </label>
    </div>
  );
};

export default InputForm;
