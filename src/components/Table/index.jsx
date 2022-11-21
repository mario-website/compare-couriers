import React, {useState, useReducer, useLayoutEffect, useEffect} from "react";
import {INITIAL_STATE, tableReducer} from "./reducer";
import AllResults from "../AllResults/index";

import {courierNameF, deliveryTimeF, serviceNameF} from "../../utils/normalizerNames";
import {VARIABLES} from "../../utils/variables";
import ParcelValues from "../SearchForm/index";
import {useBoolean} from "./hooks";

const {FAST, MEDIUM, SLOW, SMALL, LARGE, ALL, PARCEL_MONKEY, PARCEL2GO} = VARIABLES;

const Table = () => {
  const [state, dispatch] = useReducer(tableReducer, INITIAL_STATE);
  const {
    couriersData,
    currentValues,
    fetchCounter,
    allRes,
    error,
    valueClickedBtn,
    tempController,
    defaultData,
  } = state;
  //2.0
  const [currentSortingValues, setCurrentSortingValues] = useState(defaultData.options);
  const isClickedBtn = useBoolean(false);

  const setNewData = (e) => {
    e.preventDefault();
    //1.0
    handleFetchNewData(tempController, dispatch, couriersData, currentValues);
  };

  const setSorting = (item) => {
    // dispatch({type: "SET_IS_CLICKED_BTN_TO_TRUE"});
    isClickedBtn.toggle();
    dispatch({type: "SET_VALUE_CLICKED_BTN", payload: item});
  };

  return (
    <div className="Table">
      {error && (
        <p>
          error message{error.message}, error stack{error.stack}
        </p>
      )}
      <div>
        <ParcelValues
          useReducerTable={{stateCurrentValues: currentValues, dispatch}}
          setNewData={setNewData}
        />
      </div>
      <div>
        <button onClick={() => setSorting("price")}>sortByPrice</button>
        <button onClick={() => setSorting("alphabetical")}>sortByServiceName</button>
      </div>
      <div>
        <span>fetchCounter:{fetchCounter}</span>
        <div>sortedBy: {currentSortingValues.sortedBy}</div>
        <div>isAscending: {currentSortingValues.isAscending.toString()}</div>
      </div>
      <AllResults
        allResponses={allRes}
        valueClickedBtn={valueClickedBtn}
        isClickedBtn={isClickedBtn.value}
        setCurrentSortingValues={setCurrentSortingValues}
      />
    </div>
  );
};
export default Table;

//1.0
const handleFetchNewData = (tempController, dispatch, couriersData, currentValues) => {
  const controller = new AbortController();
  const {signal} = controller;
  //for any new fetch I need to cancell all current fetching in asyc functions
  //I checking if there is any of them, I need to cancel that one
  if (tempController) tempController.abort();
  dispatch({type: "SET_TEMP_CONTROLLER", payload: controller});
  //1.1
  fetchDataFromAllCouriers(signal, dispatch, couriersData, currentValues);
  return () => {
    controller.abort();
  };
};
//1.1
const fetchDataFromAllCouriers = async (
  signal,
  dispatch,
  couriersData,
  currentValues
) => {
  //every time when starting fetching new data, reset to default values
  dispatch({type: "SET_TO_DEFAULT_FETCH_COUNTER"});
  dispatch({type: "SET_TO_DEFAULT_ALL_RES"});

  // const {couriersData, currentValues} = state;
  //I might use Promise.all() but I want to do display new results after each response
  couriersData(currentValues).forEach(async (courierData) => {
    //1.2
    const data = await getData(courierData, signal);
    //todo: Change to try/catch and then prompt error if occured
    const {companyName} = courierData.names;
    //1.3
    const formatedData = formattingData(companyName, data, currentValues);

    dispatch({type: "SET_ALL_RESPONSES", payload: formatedData});
    dispatch({type: "INCREASE_FETCH_COUNTER_BY_1"});
  });
};
//1.2
const getData = async (courierData, signal) => {
  let optionsData = {};
  if (courierData.getToken) {
    const optionsToken = {
      ...courierData.getToken.options,
      ...{url: courierData.getToken.url},
    };
    //1.2.1
    const tokken = await fetching(courierData.names.apiUrl, {
      method: "POST",
      body: JSON.stringify(optionsToken),
      headers: {
        "Content-Type": "application/json",
      },
      signal,
    });
    optionsData = {
      ...courierData.getData.options,
      headers: {
        ...courierData.getData.options.headers,
        Authorization: `Bearer ${tokken.access_token}`,
      },
      ...{url: courierData.getData.url},
    };
  }

  optionsData = {
    ...courierData.getData.options,
    ...{url: courierData.getData.url},
    ...optionsData,
  };
  //1.2.1
  const data = await fetching(courierData.names.apiUrl, {
    method: "POST",
    body: JSON.stringify(optionsData),
    headers: {
      "Content-Type": "application/json",
    },
    signal,
  });
  return data;
};
//1.2.1
const fetching = async (url, options) => {
  // console.log(`url, options:`, url, options);
  const fetchRes = await fetch(url, options)
    .then((res) => res.json())
    .then((body) => {
      // console.log(`body:`, body);
      return body;
    })
    .catch((error) => {
      // console.log("Server failed to return data: " + error);
      return error;
    });
  return fetchRes;
};
//1.3
const formattingData = (companyName, data, dimension) => {
  const {WEIGHT, LENGTH, WIDTH, HEIGHT} = dimension;
  const formatedData = [];
  switch (companyName) {
    case PARCEL2GO:
      data.Quotes.forEach((item) => {
        const courierName = courierNameF(item.Service.CourierName, companyName);
        const serviceName = serviceNameF(item.Service.Name, companyName);
        const deliveryTime = deliveryTimeF(item.Service.Classification, companyName);
        const price = item.TotalPrice.toFixed(2);
        const url = `https://www.parcel2go.com/quotes?col=219&dest=219&mdd=0&mode=Default&p=1~${WEIGHT}|${LENGTH}|${WIDTH}|${HEIGHT}&quoteType=Default`;
        formatedData.push({
          companyName,
          courierName,
          serviceName,
          price,
          deliveryTime,
          url,
        });
      });
      break;

    case PARCEL_MONKEY:
      // console.log(`data:`, data);
      data.forEach((item) => {
        // console.log(`item:`, item);
        const courierName = courierNameF(item.carrier, companyName);
        const serviceName = serviceNameF(item.service, companyName);
        const deliveryTime = deliveryTimeF(item.service_name, companyName);
        const price = item.total_price_gross;
        const url = "https://www.parcelmonkey.co.uk/";
        formatedData.push({
          companyName,
          courierName,
          serviceName,
          price,
          deliveryTime,
          url,
        });
      });
      break;

    default:
      break;
  }
  return formatedData;
};
