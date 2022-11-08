import React, {useState, useEffect, useReducer} from "react";
import ColumnOfDeliveryTime from "./ColumnOfDeliveryTime/ColumnOfDeliveryTime";
import {VARIABLES} from "../../../store/variables";
import {dynamicSort} from "../../../store/functions";
import {INITIAL_STATE, allResReducer} from "../../../store/allResReducer";
import {defaultValues} from "../../../store/couriers";

const {FAST, MEDIUM, SLOW, SMALL, LARGE, ALL} = VARIABLES;

const AllResults = ({
  allResponses,
  screenSize,
  valueClickedBtn,
  isClickedBtn,
  setClickedBtnToFalse,
  setCurrentSortingValues,
}) => {
  const [state, dispatch] = useReducer(allResReducer, INITIAL_STATE);
  const {defaultData, filteredData} = state;
  const defaultOptions = defaultData.options;
  const defValIsAscending = defaultOptions.isAscending;
  const [workingData, setWorkingData] = useState(defaultData);
  const [, setCurrentScreenSize] = useState(screenSize);

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
        const newData = sorting(data, defValIsAscending, screenSize);
        return newData;
      });
    }
  }, [screenSize, defValIsAscending, filteredData, defaultData]);

  useEffect(() => {
    const isTrue = isClickedBtn && valueClickedBtn !== "";
    if (isTrue) {
      setWorkingData((prev) => {
        const newData = sorting(prev, defValIsAscending, screenSize, valueClickedBtn);
        setCurrentSortingValues(newData.options);
        return {...prev, ...newData};
      });
      setClickedBtnToFalse();
    }
  }, [
    screenSize,
    valueClickedBtn,
    defValIsAscending,
    isClickedBtn,
    setCurrentSortingValues,
    setClickedBtnToFalse,
  ]);

  const handleDeliveryTime = (e, btn) => {
    e.preventDefault();
    const filteredAllData = workingData.mergedAllData.filter(
      (e) => e.deliveryTime === btn
    );
    const newData = {...workingData, ...{data: filteredAllData}};
    const sortedData = sorting(newData, defValIsAscending);
    setWorkingData(sortedData);
    // dispatch({
    //   type: "SET_NEW_FILTERED_DATA",
    //   payload: sortedData,
    // });
  };

  return (
    <div
      style={{
        display: "flex",
        columnGap: "20px",
        flexDirection: screenSize === SMALL ? "column" : "",
      }}>
      <div>
        {screenSize === SMALL &&
          workingData.mergedAllData?.map((timeSpeed) => {
            const deliveryTimeBtn = timeSpeed.deliveryTime;
            return (
              <button
                key={timeSpeed.id}
                onClick={(e) => handleDeliveryTime(e, deliveryTimeBtn)}>
                {delTime(deliveryTimeBtn)}
              </button>
            );
          })}
      </div>
      {workingData.data.map((timeSpeed) => {
        return (
          <div
            key={timeSpeed.id}
            className={timeSpeed.deliveryTime}
            style={{
              display: "flex",
              flexDirection: "column",
              width: "-webkit-fill-available",
            }}>
            <span>{delTime(timeSpeed.deliveryTime)}</span>
            <ColumnOfDeliveryTime timeSpeedData={timeSpeed.timeSpeedData} />
          </div>
        );
      })}
    </div>
  );
};

export default AllResults;

const delTime = (time) => {
  if (time === FAST) return "Next Day Delivery";
  if (time === MEDIUM) return "2 Days Delivery";
  if (time === SLOW) return "3 or more Days Delivery";
  if (time === ALL) return "All services";
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

const sorting = (filteredData, defaultValueIsAscending, screenSize, sortBy) => {
  //the goal is to sort via sorting button (passed sortBy) or not and
  //return in object filteredData.options current sorting
  //if sortBy is passed then is checking is previous button where the same
  //if where the same reversal sorting is doing, if not defalut sorting is doing
  //if case when not sortBy is passed, then just sort via filteredData.options
  // console.log(`filteredData:`, filteredData);
  let data = filteredData.data;
  if (screenSize === LARGE) {
    data = filteredData.mergedAllData.filter((e) => e.deliveryTime !== "ALL");
  } else if (screenSize === SMALL) {
    data = filteredData.mergedAllData.filter((e) => e.deliveryTime === "ALL");
  }
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
