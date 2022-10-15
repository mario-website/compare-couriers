import React, {useState, useReducer} from "react";
import {INITIAL_STATE, postReducer} from "../../store/postReducer";
// import {handleFetchNewData, sorting} from "./functions";
import AllResults from "./AllResults/AllResults";
import normalizerNames from "../../store/normalizerNames";
import {COURIER_NAMES} from "../../store/postActionTypes";
import {dynamicSort} from "../../store/functions";

const Table = () => {
  const [data, setData] = useState([]);
  const [state, dispatch] = useReducer(postReducer, INITIAL_STATE);
  const [allResponses, setAllResponses] = useState([]);
  const [fetchCounter, setFetchCounter] = useState(0);
  const [tempController, setTempController] = useState();
  const {defValIsAscending} = state.defaultValues.isAscending;

  const setNewData = () => {
    handleFetchNewData(
      tempController,
      setTempController,
      setFetchCounter,
      setAllResponses,
      setData,
      state
    );
  };

  const setSorting = (sortBy) => {
    sorting(sortBy, data, defValIsAscending, setData);
  };

  return (
    <div className="Table">
      {state.error !== false && (
        <p>
          error message{state.error.message}, error stack{state.error.stack}
        </p>
      )}
      <p>Server port:{process.env.REACT_APP_LOCAL_SERVER_PORT}</p>
      <button onClick={setNewData}>get data</button>
      <button onClick={() => setSorting("price")}>sortByPrice</button>
      <button onClick={() => setSorting("alphabetical")}>sortByServiceName</button>
      <span>fetchCounter:{fetchCounter}</span>
      <AllResults data={data} />
    </div>
  );
};
export default Table;

const {PARCEL_MONKEY, PARCEL2GO} = COURIER_NAMES;

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

const getData = async (courierData, signal) => {
  let optionsData = {};
  if (courierData.getToken) {
    const optionsToken = {
      ...courierData.getToken.options,
      ...{url: courierData.getToken.url},
    };
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

const formattingData = (companyName, data, dimension) => {
  const formatedData = [];
  switch (companyName) {
    case PARCEL2GO:
      // console.log(`data:`, data);
      data.Quotes.forEach((item) => {
        const courierName = normalizerNames.courierName(
          item.Service.CourierName,
          companyName
        );
        const serviceName = normalizerNames.serviceName(item.Service.Name, companyName);
        const deliveryTime = normalizerNames.deliveryTime(
          item.Service.Classification,
          companyName
        );
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
        const courierName = normalizerNames.courierName(item.carrier, companyName);
        const serviceName = normalizerNames.serviceName(item.service, companyName);
        const deliveryTime = normalizerNames.deliveryTime(item.service_name, companyName);
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

const getNewData = (tempAllRes, formatedData) => {
  //ie. onlyUniqueServicesName = ['DX 24H', 'DHL UK NextDay by 9am'] so 'DX 24H' will not repeat in this array
  const onlyUniqueServicesName = [];

  //like allDelveryTimes = [FAST', 'MEDIUM']
  const allDelveryTimes = [];
  formatedData.forEach((item) => {
    if (!onlyUniqueServicesName.includes(item.serviceName)) {
      onlyUniqueServicesName.push(item.serviceName);
    }
    if (!allDelveryTimes.includes(item.deliveryTime) && item.deliveryTime !== "") {
      allDelveryTimes.push(item.deliveryTime);
    }
  });
  // console.log(`allDelveryTimes:`, allDelveryTimes);

  //added unique ID for each entry
  const withIdTempAllRes = tempAllRes.map((item, id) => {
    return {...item, id};
  });

  const newData = allDelveryTimes.map((deliveryTime, idDelTime) => {
    const filteredWithDelTime = withIdTempAllRes.filter(
      (singleData) => singleData.deliveryTime === deliveryTime
    );
    const allServicesNames = [];

    filteredWithDelTime.forEach((singleData) => {
      if (
        !allServicesNames.includes(singleData.serviceName) &&
        singleData.serviceName !== ""
      )
        allServicesNames.push(singleData.serviceName);
    });

    const sortedBy = "price";
    const isAscending = true;
    const tempData = allServicesNames.map((serviceName, idService) => {
      const filteredWithServiceName = filteredWithDelTime.filter(
        (item) => item.serviceName === serviceName
      );
      filteredWithServiceName.sort(dynamicSort(sortedBy));
      const min = Math.min(...filteredWithServiceName.map((item) => item.price));
      const max = Math.max(...filteredWithServiceName.map((item) => item.price));
      return {
        id: idService + serviceName,
        min,
        max,
        serviceData: filteredWithServiceName,
        serviceName,
      };
    });

    const minPrice = Math.min(...tempData.map((item) => item.min));
    const maxPrice = Math.max(...tempData.map((item) => item.max));

    tempData.sort(dynamicSort("min"));
    return {
      id: idDelTime + deliveryTime,
      sortedBy,
      isAscending,
      deliveryTime,
      timeSpeedData: tempData,
      minPrice,
      maxPrice,
    };
  });
  return newData;
};

const getSortValSD = (sortBy, isAscending) => {
  if (sortBy === "price") return isAscending ? "price" : "-price";

  //if condition where not matched then default value is returned
  //like if clicked sorting("alphabetical")
  return "price";
};

const sorting = (sortBy, data, defaultValueIsAscending, setData) => {
  //the goal is when is sorting sortBy for the first time,
  //everytime is sorted by default which is set under state.defaultValues.isAscending
  const sortedData = data.map((timeSpeed) => {
    //when clicking button sorting, reversal value of timeSpeed.isAscending is set
    //but only if prevoius click where also the same, if not, load defalut value
    timeSpeed.isAscending =
      timeSpeed.sortedBy !== sortBy ? !defaultValueIsAscending : !timeSpeed.isAscending;

    const {timeSpeedData, isAscending} = timeSpeed;
    const sortingBy = sortBy === "price" ? "min" : "serviceName";
    const valSortByTS = isAscending ? sortingBy : `-${sortingBy}`;
    timeSpeedData.sort(dynamicSort(valSortByTS));
    timeSpeedData.forEach((speedData) => {
      const valSortBySD = getSortValSD(sortBy, isAscending);
      speedData.serviceData.sort(dynamicSort(valSortBySD));
    });
    timeSpeed.sortedBy = sortBy;
    return timeSpeed;
  });
  // console.log(`sortedData:`, sortedData);
  setData(sortedData);
};

const handleFetchNewData = (
  tempController,
  setTempController,
  setFetchCounter,
  setAllResponses,
  setData,
  state
) => {
  const controller = new AbortController();
  const {signal} = controller;

  //so for any new fetch I need to cancell all current fetching in asyc functions
  //so I checking if there is any of them, I need to cancel that one
  if (tempController) tempController.abort();

  setTempController(controller);
  fetchDataFromAllCouriers(signal, setFetchCounter, setAllResponses, setData, state);
  // console.log("handleClick");
  return () => {
    controller.abort();
  };
};

const fetchDataFromAllCouriers = async (
  signal,
  setFetchCounter,
  setAllResponses,
  setData,
  state
) => {
  //every time when starting fetching all data, reset to default values
  setFetchCounter(0);
  setAllResponses([]);
  setData([]);

  const {forFetchingData, defaultValues} = state;
  //I might use Promise.all() but I want to do display new results after each response
  forFetchingData.forEach(async (courierData) => {
    const data = await getData(courierData, signal);
    //todo: Change to try/catch and then prompt error if occured
    const {companyName} = courierData.names;
    const formatedData = formattingData(companyName, data, defaultValues);

    setAllResponses((prev) => {
      const tempAllRes = [...prev, ...formatedData];
      const newData = getNewData(tempAllRes, formatedData);
      setData(newData);
      return tempAllRes;
    });
    setFetchCounter((prev) => prev + 1);
  });
};
