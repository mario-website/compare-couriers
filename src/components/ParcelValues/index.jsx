import React, {useState} from "react";
import InputForm from "./InputForm";
import {VARIABLES} from "../../utils/variables";
import "./style.scss";

const {WEIGHT, LENGTH, WIDTH, HEIGHT} = VARIABLES;

const ParcelValues = ({useReducerTable, setNewData}) => {
  const [classNames, setClassNames] = useState({
    showAllDimensionsAndWeight: "",
    displayNone: "",
    displayGrid: "",
    removeGap: "",
  });
  const dimensions = [
    {name: LENGTH, labelName: "Length", placeholder: "Length in cm", units: "cm"},
    {name: WIDTH, labelName: "Width", placeholder: "Width in cm", units: "cm"},
    {name: HEIGHT, labelName: "Height", placeholder: "Height in cm", units: "cm"},
  ];
  const weight = {
    name: WEIGHT,
    labelName: "Weight",
    placeholder: "Weight in kg",
    units: "kg",
  };

  const handleClick = (e) => {
    e.preventDefault();

    setClassNames({
      showAllDimensionsAndWeight: "showAllDimensionsAndWeight",
      displayNone: "displayNone",
      displayGrid: "displayGrid",
      removeGap: "removeGap",
    });
  };

  return (
    <form className="ParcelValues" id="form1" onSubmit={setNewData}>
      <div className="ParcelValues-Title">
        <p>Send UK to UK</p>
        <div className={`ParcelValues-Dimensions ${classNames.removeGap}`}>
          <button
            className={`ParcelValues-Dimensions_lessThan1Metre ${classNames.displayNone}`}
            onClick={handleClick}
            type="submit">
            <InputForm
              key={"keylessThan1Metre"}
              placeholder={"without dimensions"}
              name={"Less than 1 Metre"}
              labelName={"Parcel Length - click to modify"}
              useReducerTable={useReducerTable}
            />
          </button>
          <div
            className={`ParcelValues-Dimensions_weight ${classNames.showAllDimensionsAndWeight}`}>
            <InputForm
              key={"key" + weight.name}
              placeholder={weight.placeholder}
              name={weight.name}
              labelName={weight.labelName}
              useReducerTable={useReducerTable}
              units={weight.units}
            />
            <div className={`ParcelValues-Dimensions_lengths ${classNames.displayGrid}`}>
              {dimensions.map((e, i) => {
                return (
                  <InputForm
                    key={i + e.name}
                    placeholder={e.placeholder}
                    name={e.name}
                    labelName={e.labelName}
                    useReducerTable={useReducerTable}
                    units={e.units}
                  />
                );
              })}
            </div>
          </div>
        </div>
        <button>Get Quote</button>
      </div>
    </form>
  );
};

export default ParcelValues;
