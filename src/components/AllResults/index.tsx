import React, {useState, useEffect, useReducer} from "react";
import Table from "./Table";
import Filter from "./Filter";
import {VARIABLES} from "../../utils/variables";
import {dynamicSort, generateUUID} from "../../utils/utils";
import {INITIAL_STATE, allResReducer} from "./reducer";
import {defaultValues, DefaultData, DefaultValues} from "../../utils/couriersFetchData";
import {useScreenSize, getScreenSize} from "./hooks";
import {ReturnUseBoolean, useBoolean} from "../Main/hooks";
import "./style.scss";

const {FAST, MEDIUM, SLOW, SMALL, LARGE, ALL} = VARIABLES;

const AllResults = ({
  allResponses,
  fetchCounter,
  isSearching,
}: {
  allResponses: any[];
  fetchCounter: number;
  isSearching: boolean;
}) => {
  const [state, dispatch] = useReducer(allResReducer, INITIAL_STATE);
  const {defaultData} = state;
  const defaultOptions = defaultData.options;
  const defValIsAscending = defaultOptions.isAscending;
  const [screenSize] = useScreenSize();
  const [workingData, setWorkingData] = useState<DefaultData>(defaultData);
  const [currentScreenSize, setCurrentScreenSize] = useState<string>(screenSize);
  const [valClickedSoring, setValClickedSoring] = useState("");
  const [currentSortingValues, setCurrentSortingValues] = useState(defaultData.options);
  const isClickedBtn = useBoolean(false);

  useEffect(() => {
    setCurrentSortingValues(workingData.options);
  }, [setCurrentSortingValues, workingData.options]);

  //this useEffect is working when new data is received from another courier
  useEffect(() => {
    //when from new courier data received...
    if (allResponses.length) {
      const newData = createNewData(allResponses, defaultValues);
      //1.0
      //create dataAllResponses with only allResponses using default values
      const newFilteredData = filterData(newData, defaultOptions);
      const sortedFD = sorting(
        newFilteredData,
        defValIsAscending,
        getScreenSize(window.innerWidth),
        newFilteredData.options.deliveryTimeBtn
      );
      setWorkingData(sortedFD);
      return;
    }

    //when new courier data received and do not contain any data then all is set to default...
    setWorkingData(defaultData);
  }, [allResponses, defValIsAscending, defaultData, defaultOptions]);

  useEffect(() => {
    if (isClickedBtn.value) {
      setWorkingData((prev) => {
        const sortedData = sorting(
          prev,
          defValIsAscending,
          screenSize,
          prev.options.deliveryTimeBtn,
          valClickedSoring
        );
        return sortedData;
      });
      isClickedBtn.setFalse();
    } else {
      if (currentScreenSize !== screenSize) {
        setWorkingData((prev) => {
          const sortedData = sorting(
            prev,
            defValIsAscending,
            screenSize,
            prev.options.deliveryTimeBtn
          );
          return sortedData;
        });
        setCurrentScreenSize(screenSize);
      }
    }
  }, [defValIsAscending, screenSize, valClickedSoring, isClickedBtn, currentScreenSize]);

  const handleDeliveryTime = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    deliveryTimeBtn: string
  ) => {
    event.preventDefault();
    const sortedData = sorting(
      workingData,
      defValIsAscending,
      screenSize,
      deliveryTimeBtn
    );
    setWorkingData(sortedData);
  };

  const setSorting = (item: string) => {
    // e.preventDefault();
    setValClickedSoring(item);

    // dispatch({type: "SET_IS_CLICKED_BTN_TO_TRUE"});
    isClickedBtn.setTrue();
    // dispatch({type: "SET_VALUE_CLICKED_BTN", payload: item});
  };
  return (
    <section className="Results">
      {isSearching && fetchCounter === 0 && <p>is searching</p>}
      {fetchCounter > 0 && (
        <>
          <Filter
            setSorting={setSorting}
            fetchCounter={fetchCounter}
            currentSortingValues={currentSortingValues}
            screenSize={screenSize}
            workingData={workingData}
            handleDeliveryTime={handleDeliveryTime}
            delTime={delTime}
          />
          <Table workingData={workingData} delTime={delTime} />
        </>
      )}
    </section>
  );
};

export default AllResults;

const delTime = (time: string) => {
  if (time === FAST) return "Next Day";
  if (time === MEDIUM) return "2 Days";
  if (time === SLOW) return "3 + Days";
  if (time === ALL) return "All";
};

const createNewData = (allResponses: any[], defaultValues: DefaultValues) => {
  const {IS_ASCENDING, SORTED_BY} = defaultValues;
  //added unique ID for each entry
  const withIdTempAllRes = allResponses.map((item) => {
    return {...item, id: generateUUID()};
  });
  const allServicesNames: any[] = [];

  withIdTempAllRes.forEach((singleData) => {
    if (
      //filtering if in allServicesNames array exist singleData.serviceName
      //AND is not an empty string. If yes, do not do anything
      !allServicesNames.includes(singleData.serviceName) &&
      singleData.serviceName !== ""
    )
      allServicesNames.push(singleData.serviceName);
  });

  //after having all uniques serviceName, I can start to create tempData
  const tempData = allServicesNames.map((serviceName) => {
    //looking for all objects who is the same as serviceName
    const filteredWithServiceName = withIdTempAllRes.filter(
      (item) => item.serviceName === serviceName
    );
    const deliveryTime = filteredWithServiceName[0].deliveryTime;
    filteredWithServiceName.sort(dynamicSort(SORTED_BY));
    const min = Math.min(...filteredWithServiceName.map((item) => item.price));
    const max = Math.max(...filteredWithServiceName.map((item) => item.price));
    const returnTempData = {
      id: generateUUID(),
      min,
      max,
      deliveryTime,
      serviceData: filteredWithServiceName,
      serviceName,
    };
    return returnTempData;
  });

  const minPrice = Math.min(...tempData.map((item) => item.min));
  const maxPrice = Math.max(...tempData.map((item) => item.max));

  tempData.sort(dynamicSort("min"));

  const returnNewData = [
    {
      id: generateUUID(),
      deliveryTime: ALL,
      minPrice,
      maxPrice,
      timeSpeedData: tempData,
    },
  ];
  const returnGetNewData = {
    ...defaultValues,
    options: {
      sortedBy: SORTED_BY,
      isAscending: IS_ASCENDING,
    },
    data: returnNewData,
  };
  return returnGetNewData;
};

const filterData = (
  allData: {options?: {sortedBy: string; isAscending: boolean}; data: any},
  options: DefaultData["options"]
) => {
  const TSD = allData.data[0].timeSpeedData;
  const unique = Array.from(
    new Set(TSD.map((item: {deliveryTime: any}) => item.deliveryTime))
  );

  const newData = unique.map((ele: any, index) => {
    const filteredWithDelTime = TSD.filter(
      (singleData: {deliveryTime: unknown}) => singleData.deliveryTime === ele
    );
    const minPrice = Math.min(...filteredWithDelTime.map((item: {min: any}) => item.min));
    const maxPrice = Math.max(...filteredWithDelTime.map((item: {max: any}) => item.max));
    return {
      id: generateUUID(),
      deliveryTime: ele,
      minPrice,
      maxPrice,
      timeSpeedData: [...filteredWithDelTime],
    };
  });
  newData.sort(dynamicSort("deliveryTime"));

  const mergedAllData = [...newData];
  mergedAllData.push(allData.data[0]);
  mergedAllData.sort(dynamicSort("deliveryTime"));

  return {
    ...{titles: []},
    ...{options: {...options}},
    ...{data: allData.data},
    mergedAllData,
  };
};

const sorting = (
  filteredData: DefaultData,
  defaultValueIsAscending: boolean,
  screenSize: string,
  deliveryTimeBtn: string,
  sortBy?: string
) => {
  //1.0 if sortBy is passed then is checking is previous button where the same
  //1.0.1 if where the same reversal sorting is doing,
  //1.0.2 if not defalut sorting is doing
  //1.1 if case when not sortBy is passed, then just sort via filteredData.options
  //2. return in object returnSorting.filteredData.options current sorting
  const data =
    screenSize === LARGE
      ? filteredData.mergedAllData.filter((e) => e.deliveryTime !== "ALL")
      : filteredData.mergedAllData.filter((e) => e.deliveryTime === deliveryTimeBtn);

  const {options} = filteredData;
  const {isAscending, sortedBy} = options;
  const isAsc = isSortedByAscending(
    isAscending,
    defaultValueIsAscending,
    sortedBy,
    sortBy
  );

  const sortedData = data.map((timeSpeedObj) => {
    const timeSpeedData = [...timeSpeedObj.timeSpeedData];
    const TSDSortBy = setSortingBy(isAsc, options, sortBy);
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

  const mediumSortedData: any = [
    {
      id: generateUUID(),
      deliveryTime: sortedData[0]?.deliveryTime,
      minPrice: sortedData[0]?.minPrice,
      maxPrice: sortedData[0]?.maxPrice,
      timeSpeedData: [],
    },
    {
      id: generateUUID(),
      deliveryTime: sortedData[0]?.deliveryTime,
      minPrice: sortedData[0]?.minPrice,
      maxPrice: sortedData[0]?.maxPrice,
      timeSpeedData: [],
    },
  ];

  if (screenSize === MEDIUM) {
    sortedData[0]?.timeSpeedData?.forEach((speedData: any, index: number) => {
      if (index % 2 === 0) {
        mediumSortedData[0].timeSpeedData.push(speedData);
      } else {
        mediumSortedData[1].timeSpeedData.push(speedData);
      }
    });
  }

  const returnData = screenSize === MEDIUM ? mediumSortedData : sortedData;
  const rowsData: any[] = [];
  returnData?.forEach((workingDataEle: {timeSpeedData: any[]}, i: number) => {
    workingDataEle.timeSpeedData?.forEach((TSD, indexData) => {
      if (i === 0) {
        rowsData.push([]);
      }
      rowsData[indexData].push(TSD);
    });
  });
  const returnSorting = {
    ...filteredData,
    ...{
      options: {
        isAscending: isAsc,
        sortedBy: sortBy ? sortBy : sortedBy,
        deliveryTimeBtn,
      },
    },
    ...{titles: Array.from(new Set(returnData.map((item: any) => item.deliveryTime)))},
    ...{data: returnData},
    rowsData,
  };

  return returnSorting;
};

const isSortedByAscending = (
  isAscending: boolean,
  defaultValueIsAscending: boolean,
  sortedBy: string,
  sortBy: string | undefined
) => {
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

const setSortingBy = (
  isAscending: boolean,
  options: {sortedBy: any; isAscending?: boolean; deliveryTimeBtn?: string},
  sortBy: string | undefined
) => {
  const isTrue = sortBy ? sortBy === "price" : options.sortedBy === "price";
  return getServiceValue(isTrue, isAscending);
  //if this sorting is not clicked with value of variable sortBy
};

const getServiceValue = (isTrue: boolean, isAscending: boolean) => {
  return isTrue
    ? isAscending
      ? "min"
      : "-max"
    : isAscending
    ? "serviceName"
    : "-serviceName";
};

const getSortValSD = (isAscending: boolean, sortedBy: string) => {
  if (sortedBy === "price") return isAscending ? "price" : "-price";
  //if condition where not matched then default value is returned
  //like if clicked setSorting("alphabetical") by default sorting is "price" by ascending
  return "price";
};
