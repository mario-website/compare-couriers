import React, {useState, useReducer, useLayoutEffect, useEffect} from "react";
import {INITIAL_STATE, postReducer} from "../../store/postReducer";
// import {handleFetchNewData, sorting} from "./functions";
import AllResults from "./AllResults/AllResults";
import normalizerNames from "../../store/normalizerNames";
import {COURIER_NAMES, VARIABLES} from "../../store/postActionTypes";
import {dynamicSort} from "../../store/functions";
const {FAST, MEDIUM, SLOW, SMALL, LARGE, ALL} = VARIABLES;

const Table = () => {
  const [data, setData] = useState({data: []});
  const [filteredData, setFilteredData] = useState({
    options: {
      sortedBy: "",
      isAscending: true,
    },
    data: [],
  });
  const [state, dispatch] = useReducer(postReducer, INITIAL_STATE);
  const [width, height] = useWindowSize();
  const [screenSize, setScreenSize] = useState(SMALL);
  const [allResponses, setAllResponses] = useState([]);
  const [fetchCounter, setFetchCounter] = useState(0);
  const [tempController, setTempController] = useState();
  const defValIsAscending = state.defaultValues.isAscending;
  const setNewData = () => {
    handleFetchNewData(
      tempController,
      setTempController,
      setFetchCounter,
      setAllResponses,
      setData,
      state,
      screenSize,
      setFilteredData
    );
  };

  useEffect(() => {
    if (data.data.length > 0) {
      const filtered = getFilteredData(screenSize, data);
      setFilteredData((prev) => {
        const newData = {...filtered, ...{options: prev.options}};
        return sorting(newData, defValIsAscending);
      });
    }
  }, [data, defValIsAscending, screenSize]);

  useEffect(() => {
    setScreenSize(getScreenSize(width));
  }, [width]);

  const setSorting = (sortBy) => {
    const sortedData = sorting(filteredData, defValIsAscending, sortBy);
    setFilteredData(sortedData);
  };

  return (
    <div className="Table">
      {state.error !== false && (
        <p>
          error message{state.error.message}, error stack{state.error.stack}
        </p>
      )}
      <div>
        <button onClick={setNewData}>get data with default values</button>
      </div>
      <div>
        <button onClick={() => setSorting("price")}>sortByPrice</button>
        <button onClick={() => setSorting("alphabetical")}>sortByServiceName</button>
      </div>
      <span>fetchCounter:{fetchCounter}</span>
      <AllResults data={filteredData.data} sorting={sorting} />
    </div>
  );
};
export default Table;

const {PARCEL_MONKEY, PARCEL2GO} = COURIER_NAMES;

const getScreenSize = (width) => {
  if (width < 325) return SMALL;
  if (width >= 325) return LARGE;
};

function useWindowSize() {
  const [size, setSize] = useState([0, 0]);
  useLayoutEffect(() => {
    function updateSize() {
      setSize([window.innerWidth, window.innerHeight]);
    }
    window.addEventListener("resize", updateSize);
    updateSize();
    return () => window.removeEventListener("resize", updateSize);
  }, []);
  return size;
}

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
    return {...item, ...id};
  });

  const sortedBy = "price";
  const isAscending = true;

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

      deliveryTime,
      timeSpeedData: tempData,
      minPrice,
      maxPrice,
    };
  });
  return {
    options: {
      sortedBy,
      isAscending,
    },
    data: newData,
  };
};

const getSortValSD = (isAscending, sortedBy) => {
  if (sortedBy === "price") return isAscending ? "price" : "-price";

  //if condition where not matched then default value is returned
  //like if clicked sorting("alphabetical") by default sorting is "price" by ascending
  return "price";
};

const isSortedByAscending = (isAscending, defaultValueIsAscending, sortedBy, sortBy) => {
  if (sortBy) {
    //when clicking button sorting, I check if fired button is the same as current sorting
    //if yes, returning current sorting I need to revert value isAscending,
    //otherwise default sorting
    return sortedBy === sortBy ? !isAscending : defaultValueIsAscending;
  } else {
    //if there is no value under sortBy (this function just sort data with current value of isAscending)
    return isAscending;
  }
};

const getServiceValue = (isTrue, isAscending) => {
  return isTrue
    ? isAscending
      ? "min"
      : "-min"
    : isAscending
    ? "serviceName"
    : "-serviceName";
};
const getSortingBy = (isAscending, options, sortBy) => {
  if (sortBy) {
    const isTrue = sortBy === "price";
    return getServiceValue(isTrue, isAscending);
  }

  //if this sorting is not clicked with variable sortBy
  const isTrue = options.sortedBy === "price";
  return getServiceValue(isTrue, isAscending);
};

const sorting = (filteredData, defaultValueIsAscending, sortBy) => {
  const {data, options} = filteredData;
  const {isAscending, sortedBy} = options;
  const isAsc = isSortedByAscending(
    isAscending,
    defaultValueIsAscending,
    sortedBy,
    sortBy
  );

  const sortedData = data.map((timeSpeedObj) => {
    const timeSpeedData = [...timeSpeedObj.timeSpeedData];
    const TSDSortBy = getSortingBy(isAsc, options, sortBy);
    timeSpeedData.sort(dynamicSort(TSDSortBy));

    const sortedTSD = timeSpeedData.map((speedData) => {
      const valSortBySD = getSortValSD(isAsc, sortedBy);
      const serviceData = [...speedData.serviceData];
      //no need to sort if in array is only one object
      if (serviceData.length > 1) {
        serviceData.sort(dynamicSort(valSortBySD));
      }
      const returnSortedTSD = {...speedData, ...{serviceData}};
      return returnSortedTSD;
    });

    const returnSortedData = {...timeSpeedObj, ...{timeSpeedData: sortedTSD}};
    return returnSortedData;
  });

  const returnSorting = {
    ...filteredData,
    ...{
      options: {
        isAscending: isAsc,
        sortedBy: sortBy ? sortBy : sortedBy,
      },
    },
    ...{data: sortedData},
  };

  return returnSorting;
};

const handleFetchNewData = (
  tempController,
  setTempController,
  setFetchCounter,
  setAllResponses,
  setData,
  state,
  screenSize,
  setFilteredData
) => {
  const controller = new AbortController();
  const {signal} = controller;

  //so for any new fetch I need to cancell all current fetching in asyc functions
  //so I checking if there is any of them, I need to cancel that one
  if (tempController) tempController.abort();

  setTempController(controller);
  fetchDataFromAllCouriers(
    signal,
    setFetchCounter,
    setAllResponses,
    setData,
    state,
    screenSize,
    setFilteredData
  );
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
  state,
  screenSize,
  setFilteredData
) => {
  //every time when starting fetching all data, reset to default values
  setFetchCounter(0);
  setAllResponses([]);
  setData({data: []});

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
      const filteredData = getFilteredData(screenSize, newData);
      setFilteredData(filteredData);
      return tempAllRes;
    });
    setFetchCounter((prev) => prev + 1);
  });
};

const getFilteredData = (screenSize, newData) => {
  if (screenSize === SMALL) {
    const tempData = [
      {
        id: "0ALL",
        deliveryTime: ALL,
        minPrice: 5.99,
        maxPrice: 5.99,
        timeSpeedData: [],
      },
    ];
    const allTSD = newData.data.map((e) => e.timeSpeedData);
    const mergedAllTSD = allTSD.flat(1);

    tempData[0].timeSpeedData = mergedAllTSD;
    return {...newData, ...{data: tempData}};
  } else {
    return newData;
  }
};
