import React, {useState, useEffect, useReducer} from "react";
import ColumnOfDeliveryTime from "./ColumnOfDeliveryTime";
import {VARIABLES} from "../../utils/variables";
import {dynamicSort, generateUUID} from "../../utils/utils";
import {INITIAL_STATE, allResReducer} from "./reducer";
import {defaultValues, DefaultData, DefaultValues} from "../../utils/couriersFetchData";
import {useScreenSize, getScreenSize} from "./hooks";
import {ReturnUseBoolean} from "../Table/hooks";

const {FAST, MEDIUM, SLOW, SMALL, LARGE, ALL} = VARIABLES;

const AllResults = ({
  allResponses,
  setCurrentSortingValues,
  valClickedSoring,
  isClickedBtn,
}: {
  allResponses: any[];
  setCurrentSortingValues: React.Dispatch<React.SetStateAction<DefaultData["options"]>>;
  valClickedSoring: string;
  isClickedBtn: ReturnUseBoolean;
}) => {
  const [state, dispatch] = useReducer(allResReducer, INITIAL_STATE);
  const {defaultData} = state;
  const defaultOptions = defaultData.options;
  const defValIsAscending = defaultOptions.isAscending;
  const [screenSize] = useScreenSize();
  const [workingData, setWorkingData] = useState<DefaultData>(defaultData);
  const [currentScreenSize, setCurrentScreenSize] = useState<string>(screenSize);

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

  const columnGap = 20;
  return (
    <div
      style={{
        display: "flex",
        columnGap: `${columnGap}px`,
        flexDirection:
          screenSize === SMALL || screenSize === MEDIUM ? "column" : undefined,
      }}>
      {(screenSize === SMALL || screenSize === MEDIUM) && (
        <div>
          {/* to show buttons deliveryTimeBtn */}
          {workingData.mergedAllData?.map((timeSpeed) => {
            const deliveryTimeBtn = timeSpeed.deliveryTime;
            const currentLength = timeSpeed.timeSpeedData.length;
            const minPrice = timeSpeed.minPrice.toFixed(2);
            return (
              <button
                key={timeSpeed.id}
                style={{
                  backgroundColor:
                    deliveryTimeBtn === workingData.options.deliveryTimeBtn
                      ? "darkgray"
                      : "",
                }}
                onClick={(e) => handleDeliveryTime(e, deliveryTimeBtn)}>
                <>
                  <p>{delTime(deliveryTimeBtn)}</p>
                  <p>
                    {currentLength} FROM £{minPrice}
                  </p>
                </>
              </button>
            );
          })}

          {/* to show how many services */}
          {workingData.data?.map((timeSpeed) => {
            //when screenSize === SMALL, workingData.data have only one object
            const allTimeSpeedArray = workingData.mergedAllData.find(
              (e) => e.deliveryTime === ALL
            );
            const showingCount = workingData.data[0]?.timeSpeedData.length;
            const allItemsCount = allTimeSpeedArray.timeSpeedData.length;
            const isTrue = showingCount !== allItemsCount;
            if (isTrue) {
              return (
                <p key={timeSpeed.id}>
                  Showing {showingCount} of {allItemsCount} Services
                </p>
              );
            } else {
              return <p key={timeSpeed.id}>Showing {showingCount} Services</p>;
            }
          })}
        </div>
      )}
      {workingData.data?.map((timeSpeed) => {
        return (
          <div
            key={timeSpeed.id}
            className={timeSpeed.deliveryTime}
            style={{
              display: "flex",
              flexWrap: "wrap",
              columnGap: `${columnGap}px`,
              height: "-webkit-fill-available",
              width: "-webkit-fill-available",
            }}>
            {screenSize === LARGE && (
              <span
                style={{
                  margin: "0 auto",
                }}>
                {delTime(timeSpeed.deliveryTime)}
              </span>
            )}
            <ColumnOfDeliveryTime
              timeSpeedData={timeSpeed.timeSpeedData}
              screenSize={screenSize}
              columnGap={columnGap}
            />
          </div>
        );
      })}
    </div>
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

  const returnSorting = {
    ...filteredData,
    ...{
      options: {
        isAscending: isAsc,
        sortedBy: sortBy ? sortBy : sortedBy,
        deliveryTimeBtn,
      },
    },
    ...{data: sortedData},
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
