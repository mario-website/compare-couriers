import React, {useState, useEffect, useReducer} from "react";
import ColumnOfDeliveryTime from "./ColumnOfDeliveryTime";
import {VARIABLES} from "../../utils/variables";
import {dynamicSort} from "../../utils/utils";
import {INITIAL_STATE, allResReducer} from "./reducer";
import {defaultValues} from "../../utils/couriersFetchData";
import {useScreenSize} from "./hooks";

const {FAST, MEDIUM, SLOW, SMALL, LARGE, ALL} = VARIABLES;

const AllResults = ({
  allResponses,
  valueClickedBtn,
  isClickedBtn,
  setClickedBtnToFalse,
  setCurrentSortingValues,
}) => {
  const [screenSize, prevScreenSize] = useScreenSize();
  const [state, dispatch] = useReducer(allResReducer, INITIAL_STATE);
  const {defaultData, filteredData} = state;
  const defaultOptions = defaultData.options;
  const defValIsAscending = defaultOptions.isAscending;
  const [workingData, setWorkingData] = useState(defaultData);
  const [, setCurrentScreenSize] = useState(screenSize);
  // const [screenSize, setScreenSize] = useState(useScreenSize);

  useEffect(() => {
    setCurrentSortingValues(workingData.options);
  }, [setCurrentSortingValues, workingData.options]);

  useEffect(() => {
    if (allResponses.length) {
      const newData = createNewData(allResponses, defaultValues);
      //1.0
      //create dataAllResponses with only allResponses using default values
      // dispatch({type: "SET_DATA_ALL_RESPONSES", payload: newData});
      const newFilteredData = filterData(newData, defaultOptions);
      dispatch({type: "SET_FILTERED_DATA", payload: newFilteredData});
      return;
    }
    //in Table.jsx for every click setNewData, setAllResponses([]) is set.
    dispatch({type: "SET_DATA_ALL_RESPONSES_DEFAULT"});
    dispatch({type: "SET_FILTERED_DATA", payload: defaultData});
    setWorkingData(defaultData);
  }, [allResponses, defaultData, defaultOptions]);

  useEffect(() => {
    //2.0 having filteredData.mergedAllData, I can set workingData to show all results
    //after receiving allResponses, only workingData is sorting or filtered
    if (filteredData.mergedAllData.length) {
      let data = {...filteredData};
      setWorkingData((prevWD) => {
        setCurrentScreenSize((prevCSS) => {
          //when screensize is changing, current workingData must be used for sorting: let data = {...filteredData};
          //otherwise when waiting for all data from all allResponses,
          //only filteredData.mergedAllData is set, options must be unchanged
          if (prevCSS !== screenSize)
            data = {...prevWD, ...{mergedAllData: [...filteredData.mergedAllData]}};
          return screenSize;
        });
        const newData = sorting(
          data,
          defValIsAscending,
          screenSize,
          prevWD.options.deliveryTimeBtn
        );
        return newData;
      });
    }
  }, [defValIsAscending, filteredData, defaultData]);

  useEffect(() => {
    const isTrue = isClickedBtn && valueClickedBtn !== "";
    if (isTrue) {
      setWorkingData((prev) => {
        const newData = sorting(
          prev,
          defValIsAscending,
          screenSize,
          prev.options.deliveryTimeBtn,
          valueClickedBtn
        );
        return newData;
      });
      setClickedBtnToFalse();
    }
  }, [
    screenSize,
    valueClickedBtn,
    defValIsAscending,
    isClickedBtn,
    setClickedBtnToFalse,
  ]);

  const handleDeliveryTime = (event, deliveryTimeBtn) => {
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
        flexDirection: screenSize === SMALL || screenSize === MEDIUM ? "column" : "",
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
          {workingData.data?.map((e) => {
            //when screenSize === SMALL, workingData.data have only one object
            const allTimeSpeedArray = workingData.mergedAllData.find(
              (e) => e.deliveryTime === ALL
            );
            const showingCount = workingData.data[0]?.timeSpeedData.length;
            const allItemsCount = allTimeSpeedArray.timeSpeedData.length;
            const isTrue = showingCount !== allItemsCount;
            if (isTrue) {
              return (
                <p key={e.id}>
                  Showing {showingCount} of {allItemsCount} Services
                </p>
              );
            } else {
              return <p key={e.id}>Showing {showingCount} Services</p>;
            }
          })}
        </div>
      )}
      {workingData.data.map((timeSpeed) => {
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

const delTime = (time) => {
  if (time === FAST) return "Next Day";
  if (time === MEDIUM) return "2 Days";
  if (time === SLOW) return "3 + Days";
  if (time === ALL) return "All";
};

const createNewData = (allResponses, defaultValues) => {
  const {IS_ASCENDING, SORTED_BY} = defaultValues;
  //added unique ID for each entry
  const withIdTempAllRes = allResponses.map((item, id) => {
    return {...item, ...id};
  });
  // console.log(`withIdTempAllRes:`, withIdTempAllRes);
  //looking for all objects who is the same as deliveryTime
  // const filteredWithDelTime = withIdTempAllRes.filter(
  //   (singleData) => singleData.deliveryTime === deliveryTime
  // );
  const allServicesNames = [];

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
  const tempData = allServicesNames.map((serviceName, idService) => {
    //looking for all objects who is the same as serviceName
    const filteredWithServiceName = withIdTempAllRes.filter(
      (item) => item.serviceName === serviceName
    );
    const deliveryTime = filteredWithServiceName[0].deliveryTime;
    filteredWithServiceName.sort(dynamicSort(SORTED_BY));
    const min = Math.min(...filteredWithServiceName.map((item) => item.price));
    const max = Math.max(...filteredWithServiceName.map((item) => item.price));
    const returnTempData = {
      id: idService + serviceName,
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
      id: 0 + ALL,
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

const filterData = (allData, options) => {
  const TSD = allData.data[0].timeSpeedData;
  const unique = [...new Set(TSD.map((item) => item.deliveryTime))];
  const newData = unique.map((ele, index) => {
    const filteredWithDelTime = TSD.filter(
      (singleData) => singleData.deliveryTime === ele
    );
    const minPrice = Math.min(...filteredWithDelTime.map((item) => item.min));
    const maxPrice = Math.max(...filteredWithDelTime.map((item) => item.max));
    return {
      id: index + ele,
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

  // const lar = {...{options: {...options}}, ...{data: newData}};
  // console.log(`lar:`, lar);
  // return lar;
  // } else {
  //default screenSize === ALL

  // }
  return {
    ...{options: {...options}},
    ...{data: allData.data},
    mergedAllData,
  };
};

const sorting = (
  filteredData,
  defaultValueIsAscending,
  screenSize,
  deliveryTimeBtn,
  sortBy
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

  // console.log(`returnSorting:`, returnSorting);
  return returnSorting;
};

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

const setSortingBy = (isAscending, options, sortBy) => {
  if (sortBy) {
    const isTrue = sortBy === "price";
    return getServiceValue(isTrue, isAscending);
  }
  //if this sorting is not clicked with value of variable sortBy
  const isTrue = options.sortedBy === "price";
  return getServiceValue(isTrue, isAscending);
};

const getServiceValue = (isTrue, isAscending) => {
  return isTrue
    ? isAscending
      ? "min"
      : "-max"
    : isAscending
    ? "serviceName"
    : "-serviceName";
};

const getSortValSD = (isAscending, sortedBy) => {
  if (sortedBy === "price") return isAscending ? "price" : "-price";
  //if condition where not matched then default value is returned
  //like if clicked sorting("alphabetical") by default sorting is "price" by ascending
  return "price";
};
