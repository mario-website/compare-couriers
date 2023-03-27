import React, {useState, useEffect, useReducer} from "react";
import Table from "./Table";
import Filter from "./Filter";
import {VARIABLES} from "../../utils/variables";
import {dynamicSort, generateUUID} from "../../utils/utils";
import {INITIAL_STATE, allResReducer} from "./reducer";
import {defaultValues, DefaultData, DefaultValues} from "../../utils/couriersFetchData";
import {useScreenSize, getScreenSize} from "./hooks";
import {useBoolean} from "../Main/hooks";
import "./style.scss";

const {FAST, MEDIUM, SLOW, LARGE, ALL} = VARIABLES;

const AllResults = ({
  allResponses,
  fetchCounter,
  isSearching,
  setIsSearching,
  controller,
}: {
  allResponses: SingleFormatedItem[];
  fetchCounter: number;
  isSearching: boolean;
  setIsSearching: React.Dispatch<React.SetStateAction<boolean>>;
  controller: AbortController;
}) => {
  const [state] = useReducer(allResReducer, INITIAL_STATE);
  const {defaultData} = state;
  const defaultOptions = defaultData.options;
  const defValIsAscending = defaultOptions.isAscending;
  const [screenSize] = useScreenSize();
  const [workingData, setWorkingData] = useState<DefaultData>(defaultData);
  const [currentScreenSize, setCurrentScreenSize] = useState<string>(screenSize);
  const [valClickedSoring, setValClickedSoring] = useState<string>("");
  const [currentSortingValues, setCurrentSortingValues] = useState<
    DefaultData["options"]
  >(defaultData.options);
  const isClickedBtn = useBoolean(false);
  const [isSearchingTxt, setIsSearchingTxt] = useState<string>("please wait...");
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);

  useEffect(() => {
    if (isSearching) {
      setIsOpenModal(allResponses.length === 0);
      const displaySearchingTime = 8500;
      const nothingFoundDisplayTime = 1500;
      const maxiumuDisplayTime = displaySearchingTime + nothingFoundDisplayTime;

      const timer1 = setTimeout(() => {
        if (allResponses.length === 0) setIsSearchingTxt("nothing found");
      }, maxiumuDisplayTime - nothingFoundDisplayTime);

      const timer2 = setTimeout(() => {
        setIsSearching(false);
        setIsOpenModal(false);
        setIsSearchingTxt("please wait...");
        //to stop all searchings after maxiumuDisplayTime countdown
        if (allResponses.length === 0) controller.abort();
      }, maxiumuDisplayTime);

      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
      };
    }
  }, [isSearching, allResponses.length, setIsSearching, controller]);

  useEffect(() => {
    setCurrentSortingValues(workingData.options);
    // console.log(`workingData:`, workingData);
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
      {isOpenModal && (
        <div className="Results-IsSearching">
          <span>
            <div className="lds-roller">
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
            </div>
            <p>{isSearchingTxt}</p>
          </span>
        </div>
      )}
      {allResponses.length > 0 && (
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
  if (time === FAST) return "Next Day Delivery";
  if (time === MEDIUM) return "2 Days Delivery";
  if (time === SLOW) return "3 + Days Delivery";
  if (time === ALL) return "All Services";
};
interface TempData {
  id: string;
  min: number;
  max: number;
  deliveryTime: string;
  serviceData: any[];
  serviceName: string;
  courierName: string;
}

interface ReturnNewData {
  id: string;
  deliveryTime: string;
  minPrice: number;
  maxPrice: number;
  timeSpeedData: TempData[];
}

interface SingleFormatedItem {
  companyName: string;
  courierName: string;
  deliveryTime: string;
  logoSrc: string;
  price: string;
  serviceName: string;
  url: string;
}

const createNewData = (
  allResponses: SingleFormatedItem[],
  defaultValues: DefaultValues
) => {
  console.log(`allResponses:`, allResponses);
  const {IS_ASCENDING, SORTED_BY} = defaultValues;
  //added unique ID for each entry
  const withIdTempAllRes = allResponses.map((item) => {
    return {...item, id: generateUUID()};
  });
  //filtering if in acc array not exist item.serviceName
  //AND is not an empty string.
  const allServicesNames: string[] = withIdTempAllRes.reduce((acc, item) => {
    if (item.serviceName !== "" && !acc.includes(item.serviceName as never)) {
      acc.push(item.serviceName as never);
    }
    return acc;
  }, []);

  //after having all uniques serviceName, I can start to create tempData
  const tempData = allServicesNames.map((serviceName): TempData => {
    //looking for all objects who is the same as serviceName
    const filteredWithServiceName = withIdTempAllRes.filter(
      (item) => item.serviceName === serviceName
    );
    const deliveryTime = filteredWithServiceName[0].deliveryTime;
    const courierName = filteredWithServiceName[0].courierName;
    filteredWithServiceName.sort(dynamicSort(SORTED_BY));
    const min = Math.min(...filteredWithServiceName.map((item) => Number(item.price)));
    const max = Math.max(...filteredWithServiceName.map((item) => Number(item.price)));
    const returnTempData = {
      id: generateUUID(),
      min,
      max,
      deliveryTime,
      serviceData: filteredWithServiceName,
      serviceName,
      courierName,
    };
    return returnTempData;
  });

  const minPrice = Math.min(...tempData.map((item) => item.min));
  const maxPrice = Math.max(...tempData.map((item) => item.max));

  tempData.sort(dynamicSort("min"));

  const returnNewData: ReturnNewData[] = [
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
  allData: {
    options?: {sortedBy: string; isAscending: boolean};
    data: ReturnNewData[];
  },
  options: DefaultData["options"]
) => {
  const TSD: TempData[] = allData.data[0].timeSpeedData;
  const unique = Array.from(
    new Set(
      TSD.map((item: {deliveryTime: ReturnNewData["deliveryTime"]}) => item.deliveryTime)
    )
  );

  const newData = unique.map((ele: string) => {
    const filteredWithDelTime = TSD.filter(
      (singleData: {deliveryTime: ReturnNewData["deliveryTime"]}) =>
        singleData.deliveryTime === ele
    );
    const minPrice = Math.min(
      ...filteredWithDelTime.map((item: {min: number}) => item.min)
    );
    const maxPrice = Math.max(
      ...filteredWithDelTime.map((item: {max: number}) => item.max)
    );
    return {
      id: generateUUID(),
      deliveryTime: ele,
      minPrice,
      maxPrice,
      timeSpeedData: [...filteredWithDelTime],
    };
  });
  newData.sort(dynamicSort("deliveryTime"));

  const mergedAllData = [...newData, allData.data[0]].sort(dynamicSort("deliveryTime"));

  return {
    ...{titles: []},
    ...{options},
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
  const data = filteredData.mergedAllData.filter((e) =>
    screenSize === LARGE ? e.deliveryTime !== "ALL" : e.deliveryTime === deliveryTimeBtn
  );

  const {options} = filteredData;
  const {isAscending, sortedBy} = options;
  const isAsc = isSortedByAscending(
    isAscending,
    defaultValueIsAscending,
    sortedBy,
    sortBy
  );

  const sortedData = data.map((timeSpeedObj) => {
    const timeSpeedData: TempData[] = [...timeSpeedObj.timeSpeedData];
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

  const mediumSortedData: ReturnNewData[] = [
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
      const indexNum = index % 2 === 0 ? 0 : 1;
      mediumSortedData[indexNum].timeSpeedData.push(speedData);
    });
  }

  const returnData = screenSize === MEDIUM ? mediumSortedData : sortedData;

  // const allServicesNames: any[] = [];

  // withIdTempAllRes.forEach((singleData) => {
  //   if (
  //     //filtering if in allServicesNames array exist singleData.serviceName
  //     //AND is not an empty string. If yes, do not do anything
  //     !allServicesNames.includes(singleData.serviceName) &&
  //     singleData.serviceName !== ""
  //   )
  //     allServicesNames.push(singleData.serviceName);
  // });

  // const allServicesNames: string[] = withIdTempAllRes.reduce((acc, item) => {
  //   if (item.serviceName !== "" && !acc.includes(item.serviceName as never)) {
  //     acc.push(item.serviceName as never);
  //   }
  //   return acc;
  // }, []);

  const rowsData: TempData[] = returnData?.reduce((acc, item, i) => {
    item.timeSpeedData?.forEach((TSD: TempData, indexData: number) => {
      if (i === 0) {
        acc.push([]);
      }
      acc[indexData].push(TSD);
    });
    return acc;
  }, []);

  const returnSorting = {
    ...filteredData,
    ...{
      options: {
        isAscending: isAsc,
        sortedBy: sortBy ? sortBy : sortedBy,
        deliveryTimeBtn,
      },
    },
    ...{
      titles: Array.from(new Set(returnData.map((item: TempData) => item.deliveryTime))),
    },
    ...{data: returnData},
    rowsData,
  };

  return returnSorting;
};

const isSortedByAscending = (
  isAscending: boolean,
  defaultValueIsAscending: boolean,
  sortedBy: string,
  sortBy?: string
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
