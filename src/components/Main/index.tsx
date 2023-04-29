import React, {useState, useReducer} from "react";
import AllResults from "../AllResults";
import ParcelValues from "../ParcelValues";
import "./style.scss";

import {handleFetchNewData} from "./helpers";
import {INITIAL_STATE, tableReducer} from "./reducer";

const Main = () => {
  const [state, dispatchUseReducer] = useReducer(tableReducer, INITIAL_STATE);
  const [controller, setController] = useState(new AbortController());
  const [isSearching, setIsSearching] = useState(false);
  const {
    couriersData,
    currentValues,
    fetchCounter,
    allRes,
    tempController,
    couriersNamesArr,
  } = state;

  //2.0
  const setNewData = (e: {preventDefault: () => void}): void => {
    e.preventDefault();
    setIsSearching(true);
    //1.0
    handleFetchNewData(
      tempController,
      dispatchUseReducer,
      couriersData,
      currentValues,
      setController
    );
  };

  return (
    <main className="Main">
      {/* 
      //to do error
      {error && (
        <p>
          error message{error.message}, error stack{error.stack}
        </p>
      )} */}
      <ParcelValues
        useReducerTable={{stateCurrentValues: currentValues, dispatchUseReducer}}
        setNewData={setNewData}
        fetchCounter={fetchCounter}
        couriersNamesArr={couriersNamesArr}
      />
      <AllResults
        allResponses={allRes}
        fetchCounter={fetchCounter}
        isSearching={isSearching}
        setIsSearching={setIsSearching}
        controller={controller}
      />
    </main>
  );
};
export default Main;
