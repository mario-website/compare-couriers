import React from "react";

const InputForm = ({value, labelName, placeholder}) => {
  return (
    <div
    // className={nameClass}
    >
      <label>
        {labelName}
        <input
          type="text"
          value={value}
          // onChange={event => sendValue(event.target.value)}
          placeholder={placeholder}
        />
      </label>
    </div>
  );
};

export default InputForm;
