import React, {useState, useReducer, useLayoutEffect, useEffect} from "react";
import {INITIAL_STATE, postReducer} from "../../store/postReducer";
import AllResults from "./AllResults/AllResults";
import normalizerNames from "../../store/normalizerNames";
import {COURIER_NAMES, VARIABLES} from "../../store/postActionTypes";
import {dynamicSort} from "../../store/functions";

const {FAST, MEDIUM, SLOW, SMALL, LARGE, ALL} = VARIABLES;
const {IS_ASCENDING, SORTED_BY} = INITIAL_STATE.defaultValues;
const {PARCEL_MONKEY, PARCEL2GO} = COURIER_NAMES;

const defaultData = {
  options: {
    sortedBy: SORTED_BY,
    isAscending: IS_ASCENDING,
  },
  data: [],
};

const Table = () => {
  const [data, setData] = useState(defaultData);
  const [filteredData, setFilteredData] = useState(defaultData);
  const [state, dispatch] = useReducer(postReducer, INITIAL_STATE);
  //3.0
  const [width, height] = useWindowSize();
  const [screenSize, setScreenSize] = useState(SMALL);
  const [allResponses, setAllResponses] = useState([]);
  const [fetchCounter, setFetchCounter] = useState(0);
  const [tempController, setTempController] = useState();
  const defValIsAscending = IS_ASCENDING;

  const setNewData = () => {
    //1.0
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
      //1.5 - setFilteredData only when screenSize is different
      const filtered = getFilteredData(screenSize, data);
      setFilteredData((prev) => {
        const newData = {...filtered, ...{options: prev.options}};
        //2.0 - need to sort every time, when screenSize is changing
        //I might to create one data who contains all screenSize scenarios but
        //in most cases, user do not change screenSize so often like asking for new results
        //so is better for preformance to create current output data only if screenSize is changed
        return sorting(newData, defValIsAscending);
      });
    }
  }, [data, defValIsAscending, screenSize]);

  useEffect(() => {
    //4.0
    setScreenSize(getScreenSize(width));
  }, [width]);

  const setSorting = (sortBy) => {
    //2.0
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

//1.0
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

  //for any new fetch I need to cancell all current fetching in asyc functions
  //I checking if there is any of them, I need to cancel that one
  if (tempController) tempController.abort();

  setTempController(controller);
  //1.1
  fetchDataFromAllCouriers(
    signal,
    setFetchCounter,
    setAllResponses,
    setData,
    state,
    screenSize,
    setFilteredData
  );
  return () => {
    controller.abort();
  };
};
//1.1
const fetchDataFromAllCouriers = async (
  signal,
  setFetchCounter,
  setAllResponses,
  setData,
  state,
  screenSize,
  setFilteredData
) => {
  //every time when starting fetching new data, reset to default values
  setFetchCounter(0);
  setAllResponses([]);
  setData(defaultData);
  setFilteredData(defaultData);

  const {forFetchingData, defaultValues} = state;
  //I might use Promise.all() but I want to do display new results after each response
  forFetchingData.forEach(async (courierData) => {
    //1.2
    const data = await getData(courierData, signal);
    //todo: Change to try/catch and then prompt error if occured
    const {companyName} = courierData.names;
    //1.3
    const formatedData = formattingData(companyName, data, defaultValues);

    setAllResponses((prev) => {
      //for everytime when new data received (formatedData), merged with current one (prev)
      const tempAllRes = [...prev, ...formatedData];
      //1.4 - needs to create new output data and filter
      const newData = getNewData(tempAllRes, formatedData);
      setData(newData);
      //1.5 - by default, newData is created an array with each object represent
      //all delveryTimes so filteredData might be different on screenSize value
      const filteredData = getFilteredData(screenSize, newData);
      setFilteredData(filteredData);
      return tempAllRes;
    });
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
//1.4
const getNewData = (tempAllRes, formatedData) => {
  //ie. onlyUniqueServicesName = ['DX 24H', 'DHL UK NextDay by 9am'] so 'DX 24H' will not repeat in this array
  const onlyUniqueServicesName = [];

  //like allDelveryTimes = ['FAST', 'MEDIUM']
  const allDelveryTimes = [];
  formatedData.forEach((item) => {
    if (!onlyUniqueServicesName.includes(item.serviceName)) {
      onlyUniqueServicesName.push(item.serviceName);
    }
    if (!allDelveryTimes.includes(item.deliveryTime) && item.deliveryTime !== "") {
      allDelveryTimes.push(item.deliveryTime);
    }
  });

  //added unique ID for each entry
  const withIdTempAllRes = tempAllRes.map((item, id) => {
    return {...item, ...id};
  });

  const newData = allDelveryTimes.map((deliveryTime, idDelTime) => {
    //looking for all objects who is the same as deliveryTime
    const filteredWithDelTime = withIdTempAllRes.filter(
      (singleData) => singleData.deliveryTime === deliveryTime
    );
    const allServicesNames = [];

    filteredWithDelTime.forEach((singleData) => {
      if (
        //filtering if in allServicesNames array exist singleData.serviceName
        //AND is not an empty string. If yes, do not do anything
        !allServicesNames.includes(singleData.serviceName) &&
        singleData.serviceName !== ""
      )
        allServicesNames.push(singleData.serviceName);
    });

    //after having all uniques serviceName, I can start to create tempData
    const tempData = allServicesNames.map((serviceName, idService) => {
      //looking for all objects who is the same as serviceName
      const filteredWithServiceName = filteredWithDelTime.filter(
        (item) => item.serviceName === serviceName
      );
      filteredWithServiceName.sort(dynamicSort(SORTED_BY));
      const min = Math.min(...filteredWithServiceName.map((item) => item.price));
      const max = Math.max(...filteredWithServiceName.map((item) => item.price));
      const returnTempData = {
        id: idService + serviceName,
        min,
        max,
        serviceData: filteredWithServiceName,
        serviceName,
      };
      return returnTempData;
    });

    const minPrice = Math.min(...tempData.map((item) => item.min));
    const maxPrice = Math.max(...tempData.map((item) => item.max));

    tempData.sort(dynamicSort("min"));
    const returnNewData = {
      id: idDelTime + deliveryTime,
      deliveryTime,
      timeSpeedData: tempData,
      minPrice,
      maxPrice,
    };
    return returnNewData;
  });

  const returnGetNewData = {
    options: {
      sortedBy: SORTED_BY,
      isAscending: IS_ASCENDING,
    },
    data: newData,
  };
  return returnGetNewData;
};
//1.5
const getFilteredData = (screenSize, newData) => {
  if (screenSize === SMALL) {
    const allTSD = newData.data.map((e) => e.timeSpeedData);
    const mergedAllTSD = allTSD.flat(1);
    const minPrice = Math.min(...mergedAllTSD.map((item) => item.min));
    const maxPrice = Math.max(...mergedAllTSD.map((item) => item.max));
    const tempData = [
      {
        id: "0ALL",
        deliveryTime: ALL,
        minPrice,
        maxPrice,
        timeSpeedData: mergedAllTSD,
      },
    ];
    return {...newData, ...{data: tempData}};
  } else {
    return newData;
  }
};
//2.0
const sorting = (filteredData, defaultValueIsAscending, sortBy) => {
  //the goal is to sort via sorting button (passed sortBy) or not and
  //return in object filteredData.options current sorting
  //if sortBy is passed then is checking is previous button where the same
  //if where the same reversal sorting is doing, if not defalut sorting is doing
  //if case when not sortBy is passed, then just sort via filteredData.options
  const {data, options} = filteredData;
  const {isAscending, sortedBy} = options;
  //2.1
  const isAsc = isSortedByAscending(
    isAscending,
    defaultValueIsAscending,
    sortedBy,
    sortBy
  );

  const sortedData = data.map((timeSpeedObj) => {
    const timeSpeedData = [...timeSpeedObj.timeSpeedData];
    //2.2.0
    const TSDSortBy = getSortingBy(isAsc, options, sortBy);
    timeSpeedData.sort(dynamicSort(TSDSortBy));

    const sortedTSD = timeSpeedData.map((speedData) => {
      //2.3
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
//2.1
const isSortedByAscending = (isAscending, defaultValueIsAscending, sortedBy, sortBy) => {
  if (sortBy) {
    //when clicking button sorting, I check if fired button is the same as current sorting
    //if yes, I need to revert value isAscending as I want to revert value when click button,
    //otherwise default sorting
    return sortedBy === sortBy ? !isAscending : defaultValueIsAscending;
  } else {
    //if there is no value under sortBy (this function just sort data with current value of isAscending)
    return isAscending;
  }
};
//2.2.0
const getSortingBy = (isAscending, options, sortBy) => {
  if (sortBy) {
    const isTrue = sortBy === "price";
    //2.2.1
    return getServiceValue(isTrue, isAscending);
  }
  //if this sorting is not clicked with value of variable sortBy
  const isTrue = options.sortedBy === "price";
  //2.2.1
  return getServiceValue(isTrue, isAscending);
};
//2.2.1
const getServiceValue = (isTrue, isAscending) => {
  return isTrue
    ? isAscending
      ? "min"
      : "-max"
    : isAscending
    ? "serviceName"
    : "-serviceName";
};
//2.3
const getSortValSD = (isAscending, sortedBy) => {
  if (sortedBy === "price") return isAscending ? "price" : "-price";
  //if condition where not matched then default value is returned
  //like if clicked sorting("alphabetical") by default sorting is "price" by ascending
  return "price";
};
//3.0
const useWindowSize = () => {
  const [size, setSize] = useState([0, 0]);
  useLayoutEffect(() => {
    //to not setSize for every window change, added small delay 100ms for
    //reading and set curent window.innerWidth and window.innerHeight
    const withDelayUpdate = debounce(() => {
      setSize([window.innerWidth, window.innerHeight]);
    }, 100);
    window.addEventListener("resize", withDelayUpdate);

    return () => window.removeEventListener("resize", withDelayUpdate);
  }, []);
  return size;
};
//3.1
function debounce(fn, ms) {
  let timer;
  return (_) => {
    clearTimeout(timer);
    timer = setTimeout((_) => {
      timer = null;
      fn.apply(this, arguments);
    }, ms);
  };
}
//4.0
const getScreenSize = (width) => {
  if (width < 600) return SMALL;
  if (width >= 600) return LARGE;
};
