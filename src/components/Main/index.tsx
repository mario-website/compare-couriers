import React, {useState, useReducer} from "react";
import {INITIAL_STATE, tableReducer} from "./reducer";
import AllResults from "../AllResults";
import ParcelValues from "../ParcelValues";
import {
  VARIABLES,
  courierNameF,
  deliveryTimeF,
  serviceNameF,
  CourierData,
  DefaultValues,
  ReturnCouriersData,
} from "../../utils";

import "./style.scss";

const {PARCEL2GO_LOGO_SRC, PARCEL_MONKEY_LOGO_SRC, PARCEL_MONKEY, PARCEL2GO} = VARIABLES;

const Main = () => {
  const [state, dispatch] = useReducer(tableReducer, INITIAL_STATE);
  const [controller, setController] = useState<AbortController>(new AbortController());
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const {couriersData, currentValues, fetchCounter, allRes, tempController} = state;

  //2.0
  const setNewData = (e: {preventDefault: () => void}): void => {
    e.preventDefault();
    setIsSearching(true);
    //1.0
    handleFetchNewData(
      tempController,
      dispatch,
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
        useReducerTable={{stateCurrentValues: currentValues, dispatch}}
        setNewData={setNewData}
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

//1.0
const handleFetchNewData = (
  tempController: {abort: () => void},
  dispatch: React.Dispatch<{
    type: string;
    payload?: any;
  }>,
  couriersData: (values: DefaultValues) => ReturnCouriersData,
  currentValues: DefaultValues,
  setController: React.Dispatch<React.SetStateAction<AbortController>>
) => {
  const controller = new AbortController();
  const {signal} = controller;
  setController(controller);

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
  signal: AbortSignal,
  dispatch: React.Dispatch<{
    type: string;
    payload?: any;
  }>,
  couriersData: (values: DefaultValues) => ReturnCouriersData,
  currentValues: DefaultValues
) => {
  //every time when starting fetching new data, reset to default values
  dispatch({type: "SET_TO_DEFAULT_FETCH_COUNTER"});
  dispatch({type: "SET_TO_DEFAULT_ALL_RES"});

  //I might use Promise.all() but I want to do display new results after each response
  couriersData(currentValues).forEach(async (courierData: CourierData) => {
    //1.2
    const data = await getData(courierData, signal);
    //todo: Change to try/catch and then prompt error if occured
    //1.3
    const formatedData = formattingData(
      courierData.names.companyName,
      data,
      currentValues
    );

    dispatch({type: "SET_ALL_RESPONSES", payload: formatedData});
    dispatch({type: "INCREASE_FETCH_COUNTER_BY_1"});
  });
};
//1.2
const getData = async (courierData: CourierData, signal: AbortSignal) => {
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
  return await fetching(courierData.names.apiUrl, {
    method: "POST",
    body: JSON.stringify(optionsData),
    headers: {
      "Content-Type": "application/json",
    },
    signal,
  });
};

//1.2.1
const fetching = async (
  url: string,
  options: {
    method: string;
    body: string;
    headers: {"Content-Type": string};
    signal: AbortSignal;
  }
) => {
  return await fetch(url, options)
    .then((res) => res.json())
    .then((body) => body)
    .catch((error) => {
      // console.log("Server failed to return data: " + error);
      return error;
    });
};

interface SingleFormatedItem {
  companyName: string;
  courierName: string;
  serviceName: string;
  price: string;
  deliveryTime: string;
  url: string;
  logoSrc: string;
}

// const isUniqueObjectFromArray = (
//   objectToCheck: SingleFormatedItem,
//   arrayData: SingleFormatedItem[]
// ) =>
//   !arrayData.some(
//     (ele) =>
//       ele.companyName === objectToCheck.companyName &&
//       ele.courierName === objectToCheck.courierName &&
//       ele.serviceName === objectToCheck.serviceName &&
//       ele.price === objectToCheck.price &&
//       ele.deliveryTime === objectToCheck.deliveryTime
//   );

//1.3
const formattingData = (
  companyName: string,
  //data is any due to unkonow respond from server
  data: any,
  dimension: DefaultValues
): SingleFormatedItem[] => {
  const {WEIGHT, LENGTH, WIDTH, HEIGHT} = dimension;
  switch (companyName) {
    case PARCEL2GO:
      interface PARCEL2GO_Item {
        Service: {CourierName: string; Name: string; Classification: string};
        TotalPrice: number;
      }

      return data.Quotes.map((item: PARCEL2GO_Item) => {
        const courierName = courierNameF(item.Service.CourierName, companyName);
        const serviceName = serviceNameF(item.Service.Name, companyName);
        const deliveryTime = deliveryTimeF(item.Service.Classification, companyName);
        const price = item.TotalPrice.toFixed(2);
        const logoSrc = PARCEL2GO_LOGO_SRC;
        const url = `https://www.parcel2go.com/quotes?col=219&dest=219&mdd=0&mode=Default&p=1~${WEIGHT}|${LENGTH}|${WIDTH}|${HEIGHT}&quoteType=Default`;
        return {
          companyName,
          courierName,
          serviceName,
          price,
          deliveryTime,
          url,
          logoSrc,
        };
      });

    case PARCEL_MONKEY:
      interface PARCEL_MONKEY_Item {
        carrier: string;
        service: string;
        service_name: string;
        total_price_gross: string;
      }

      return data.map((item: PARCEL_MONKEY_Item) => {
        const courierName = courierNameF(item.carrier, companyName);
        const serviceName = serviceNameF(item.service, companyName);
        const deliveryTime = deliveryTimeF(item.service_name, companyName);
        const price = item.total_price_gross;
        const logoSrc = PARCEL_MONKEY_LOGO_SRC;
        const url = "https://www.parcelmonkey.co.uk/";
        return {
          companyName,
          courierName,
          serviceName,
          price,
          deliveryTime,
          url,
          logoSrc,
        };
      });

    default:
      return [];
  }
};
