import React, {useState, useEffect, useReducer} from "react";
import InputForm from "./InputForm";
// import InputCountry from "./InputCountry";
import {INITIAL_STATE, postReducer} from "../../store/postReducer";

const ParcelValues = () => {
  const [state, dispatch] = useReducer(postReducer, INITIAL_STATE);
  const {WEIGHT, LENGTH, WIDTH, HEIGHT} = state.currentValues;

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
        <InputForm
          // nameClass={this.state.displayOffOn}
          // sendValue={value => setWeight(value)}
          value={WEIGHT}
          placeholder={"Weight in kg"}
          labelName="Weight"
        />
        {/* <InputForm
          // nameClass={this.state.displayOffOn}
          sendValue={value => setWidth(value)}
          value={parcel_width}
          placeholder={"Width in cm"}
          labelName="Width"
        />
        <InputForm
          // nameClass={this.state.displayOffOn}
          sendValue={value => setHeight(value)}
          value={parcel_height}
          placeholder={"Height in cm"}
          labelName="Height"
        />
        <InputForm
          // nameClass={this.state.displayOffOn}
          sendValue={value => setLength(value)}
          value={parcel_length}
          placeholder={"Length in cm"}
          labelName="Length"
        /> */}
      </div>
      <div>
        <button>Submit</button>
      </div>
    </form>
  );
};

export default ParcelValues;
