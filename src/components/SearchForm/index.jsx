import React, {useState, useEffect, useReducer} from "react";
import InputForm from "./InputForm";
import {VARIABLES} from "../../utils/variables.js";
const {WEIGHT, LENGTH, WIDTH, HEIGHT} = VARIABLES;

const ParcelValues = ({useReducerTable, setNewData}) => {
  const dimensions = [
    {name: WEIGHT, labelName: "Weight", placeholder: "Weight in kg"},
    {name: LENGTH, labelName: "Length", placeholder: "Length in cm"},
    {name: WIDTH, labelName: "Width", placeholder: "Width in cm"},
    {name: HEIGHT, labelName: "Height", placeholder: "Height in cm"},
  ];

  return (
    <form>
      {/* <div>
        <InputCountry
          // nameClass={this.state.displayOffOn}
          sendValue={value => setCountryFrom(value)}
          value={country_from}
          labelName="Country from"
        />
        <InputForm
          // nameClass={this.state.displayOffOn}
          sendValue={value => setPostcodeFrom(value)}
          value={postcode_from}
          placeholder={"Postcode / Zip. Default is RM19 1ZY"}
          labelName=""
        />
      </div>
      <div>
        <InputCountry
          // nameClass={this.state.displayOffOn}
          sendValue={value => setCountryTo(value)}
          value={country_to}
          labelName="Country to"
        />

        <InputForm
          // nameClass={this.state.displayOffOn}
          sendValue={value => setPostcodeTo(value)}
          value={postcode_to}
          placeholder={"Postcode / Zip. Default is EC1R 3DD"}
          labelName=""
        />
      </div> */}
      <div>
        {dimensions.map((e, i) => {
          return (
            <InputForm
              // nameClass={this.state.displayOffOn}
              // sendValue={value => setWeight(value)}
              key={i + e.name}
              placeholder={e.placeholder}
              name={e.name}
              labelName={e.labelName}
              useReducerTable={useReducerTable}
            />
          );
        })}
      </div>
      <div>
        <button onClick={setNewData}>get data with values</button>
      </div>
    </form>
  );
};

export default ParcelValues;
