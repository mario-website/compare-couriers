import React, {useState, useReducer, useLayoutEffect, useEffect} from "react";
import {INITIAL_STATE, postReducer} from "../../store/postReducer.js";
import AllResults from "./AllResults/AllResults.jsx";
import {courierNameF, deliveryTimeF, serviceNameF} from "../../store/normalizerNames.js";
import {COURIER_NAMES, VARIABLES} from "../../store/postActionTypes.js";
import ParcelValues from "../SearchForm/ParcelValues.jsx";

const {FAST, MEDIUM, SLOW, SMALL, LARGE, ALL} = VARIABLES;
const {PARCEL_MONKEY, PARCEL2GO} = COURIER_NAMES;

const Table = () => {
  const [state, dispatch] = useReducer(postReducer, INITIAL_STATE);
  //2.0
  const [width, height] = useWindowSize();
  const [screenSize, setScreenSize] = useState("");
  const [allResponses, setAllResponses] = useState([]);
  const [fetchCounter, setFetchCounter] = useState(0);
  const [tempController, setTempController] = useState();
  const [valueOfClickedSorting, setValueOfClickedSorting] = useState("");
  const [clickedBtnHasBeenFired, setClickedBtnHasBeenFired] = useState(true);

  const setNewData = () => {
    //1.0
    handleFetchNewData(
      tempController,
      setTempController,
      setFetchCounter,
      setAllResponses,
      state
    );
  };

  useEffect(() => {
    //3.0
    setScreenSize(getScreenSize(width));
  }, [width]);

  const setSorting = (item) => {
    setClickedBtnHasBeenFired((prev) => !prev);
    setValueOfClickedSorting(item);
  };

  return (
    <div className="Table">
      {state.error && (
        <p>
          error message{state.error.message}, error stack{state.error.stack}
        </p>
      )}
      <div>
        <button onClick={setNewData}>get data with default values</button>
        <ParcelValues />
      </div>
      <div>
        <button onClick={() => setSorting("price")}>sortByPrice</button>
        <button onClick={() => setSorting("alphabetical")}>sortByServiceName</button>
      </div>
      <span>fetchCounter:{fetchCounter}</span>
      <AllResults
        allResponses={allResponses}
        screenSize={screenSize}
        valueOfClickedSorting={valueOfClickedSorting}
        clickedBtnHasBeenFired={clickedBtnHasBeenFired}
      />
    </div>
  );
};
export default Table;

//1.0
const handleFetchNewData = (
  tempController,
  setTempController,
  setFetchCounter,
  setAllResponses,
  state
) => {
  const controller = new AbortController();
  const {signal} = controller;
  //for any new fetch I need to cancell all current fetching in asyc functions
  //I checking if there is any of them, I need to cancel that one
  if (tempController) tempController.abort();
  setTempController(controller);
  //1.1
  fetchDataFromAllCouriers(signal, setFetchCounter, setAllResponses, state);
  return () => {
    controller.abort();
  };
};
//1.1
const fetchDataFromAllCouriers = async (
  signal,
  setFetchCounter,
  setAllResponses,
  state
) => {
  //every time when starting fetching new data, reset to default values
  setFetchCounter(0);
  setAllResponses([]);

  const {forFetchingData, currentValues} = state;
  //I might use Promise.all() but I want to do display new results after each response
  forFetchingData.forEach(async (courierData) => {
    //1.2
    const data = await getData(courierData, signal);
    //todo: Change to try/catch and then prompt error if occured
    const {companyName} = courierData.names;
    //1.3
    const formatedData = formattingData(companyName, data, currentValues);

    setAllResponses((prev) => [...prev, ...formatedData]);
    setFetchCounter((prev) => prev + 1);
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
  const formatedData = [];
  switch (companyName) {
    case PARCEL2GO:
      // console.log(`data:`, data);
      data.Quotes.forEach((item) => {
        const courierName = courierNameF(item.Service.CourierName, companyName);
        const serviceName = serviceNameF(item.Service.Name, companyName);

        // console.log(`item:`, item);
        const deliveryTime = deliveryTimeF(item.Service.Classification, companyName);
        const price = item.TotalPrice.toFixed(2);
        const url = `https://www.parcel2go.com/quotes?col=219&dest=219&mdd=0&mode=Default&p=1~${dimension.weight}|${dimension.length}|${dimension.width}|${dimension.height}&quoteType=Default`;

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
//2.0
const useWindowSize = () => {
  const [size, setSize] = useState([0, 0]);
  useLayoutEffect(() => {
    //to not setSize for every window change, added small delay 100ms for
    //reading and set curent window.innerWidth and window.innerHeight
    //founded delay at https://stackoverflow.com/a/63010184
    //3.1
    const withDelayUpdate = () => {
      setSize([window.innerWidth, window.innerHeight]);
    };
    withDelayUpdate();
    window.addEventListener("resize", withDelayUpdate);
    return () => window.removeEventListener("resize", withDelayUpdate);
  }, []);
  return size;
};
//3.0
const getScreenSize = (width) => {
  if (width < 600) return SMALL;
  if (width >= 600) return LARGE;
};
