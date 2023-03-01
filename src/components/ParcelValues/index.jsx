import React, {useState, useEffect, useReducer} from "react";
import InputForm from "./InputForm";
import {VARIABLES} from "../../utils/variables";
import "./style.scss";

const {WEIGHT, LENGTH, WIDTH, HEIGHT} = VARIABLES;

const ParcelValues = ({useReducerTable, setNewData}) => {
  const dimensions = [
    {name: LENGTH, labelName: "Length", placeholder: "Length in cm"},
    {name: WIDTH, labelName: "Width", placeholder: "Width in cm"},
    {name: HEIGHT, labelName: "Height", placeholder: "Height in cm"},
  ];
  const weight = {name: WEIGHT, labelName: "Weight", placeholder: "Weight in kg"};

  return (
    <form className="ParcelValues">
      <div className="ParcelValues-Title">
        <p>Send UK to UK</p>
      </div>
      <div className="ParcelValues-Dimensions">
        <button className="ParcelValues-Dimensions_lessThan1Metre">
          <InputForm
            key={"keylessThan1Metre"}
            placeholder={"none"}
            name={"Less than 1 Metre"}
            labelName={"Parcel Length"}
            useReducerTable={useReducerTable}
          />
        </button>
        <div className="ParcelValues-Dimensions_weight">
          <InputForm
            key={"key" + weight.name}
            placeholder={weight.placeholder}
            name={weight.name}
            labelName={weight.labelName}
            useReducerTable={useReducerTable}
          />
        </div>
      </div>
      {/* <div>
        {dimensions.map((e, i) => {
          return (
            <InputForm
              key={i + e.name}
              placeholder={e.placeholder}
              name={e.name}
              labelName={e.labelName}
              useReducerTable={useReducerTable}
            />
          );
        })}
      </div>
    */}
      <div>
        <button onClick={setNewData}>Get Quote</button>
      </div>
    </form>
  );
};

export default ParcelValues;
