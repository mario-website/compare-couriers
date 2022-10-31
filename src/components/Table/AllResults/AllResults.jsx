import React, {useState, useEffect, useReducer} from "react";
import ColumnOfDeliveryTime from "./ColumnOfDeliveryTime/ColumnOfDeliveryTime";
import {VARIABLES} from "../../../store/variables";
import {dynamicSort} from "../../../store/functions";
import {INITIAL_STATE, allResReducer} from "../../../store/allResReducer";
import {defaultValues} from "../../../store/couriers";

const {FAST, MEDIUM, SLOW, SMALL, LARGE, ALL} = VARIABLES;
const {IS_ASCENDING, SORTED_BY} = defaultValues;

const AllResults = ({
  allResponses,
  screenSize,
  valueClickedBtn,
  isClickedBtn,
  setDefaultClickedBtn,
}) => {
  const [state, dispatch] = useReducer(allResReducer, INITIAL_STATE);
  const {newFilteredData, dataAllResponses, defaultData} = state;
  const defValIsAscending = IS_ASCENDING;

  useEffect(() => {
    if (allResponses.length) {
      const newData = createNewData(allResponses, defaultValues);
      //1.
      //create dataAllResponses with only allResponses using default values
      dispatch({type: "SET_DATA_ALL_RESPONSES", payload: newData});
    } else {
      //in Table.jsx for every click setNewData, setAllResponses([]) is set.
      dispatch({type: "SET_DATA_ALL_RESPONSES_DEFAULT"});
    }
  }, [allResponses, defaultData]);

  useEffect(() => {
    //2.
    //so every time screenSize or new dataAllResponses.data is set (included sorting),
    //newFilteredData is reset with the new data.
    if (dataAllResponses.data.length) {
      const newData = filterData(dataAllResponses, screenSize);
      dispatch({type: "SET_NEW_FILTERED_DATA", payload: newData});
    }
    if (dataAllResponses.data.length === 0) {
      dispatch({type: "SET_NEW_FILTERED_DATA", payload: defaultData});
    }
  }, [defaultData, screenSize, dataAllResponses]);

  useEffect(() => {
    const isTrue = isClickedBtn && valueClickedBtn !== "";
    if (isTrue) {
      dispatch({
        type: "SET_NEW_FILTERED_DATA",
        payload: sorting(newFilteredData, defValIsAscending, valueClickedBtn),
      });

      setDefaultClickedBtn();
    }
  }, [
    valueClickedBtn,
    defValIsAscending,
    isClickedBtn,
    setDefaultClickedBtn,
    newFilteredData,
  ]);

  const handleDeliveryTime = (e, btn) => {
    e.preventDefault();
    const filteredAllData = newFilteredData.mergedAllData.filter(
      (e) => e.deliveryTime === btn
    );
    const newData = {...newFilteredData, ...{data: filteredAllData}};
    const sortedData = sorting(newData, defValIsAscending);
    dispatch({
      type: "SET_NEW_FILTERED_DATA",
      payload: sortedData,
    });
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
          newFilteredData.mergedAllData?.map((timeSpeed) => {
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
      {newFilteredData.data.map((timeSpeed) => {
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

const filterData = (allData, screenSize) => {
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

  if (screenSize === LARGE) {
    return {...{options: allData.options}, ...{data: newData}};
  } else {
    //default screenSize === ALL

    const mergedAllData = [...newData];
    mergedAllData.push(allData.data[0]);
    mergedAllData.sort(dynamicSort("deliveryTime"));

    return {
      ...{options: allData.options},
      ...{data: allData.data},
      mergedAllData,
    };
  }
};

const sorting = (filteredData, defaultValueIsAscending, sortBy) => {
  //the goal is to sort via sorting button (passed sortBy) or not and
  //return in object filteredData.options current sorting
  //if sortBy is passed then is checking is previous button where the same
  //if where the same reversal sorting is doing, if not defalut sorting is doing
  //if case when not sortBy is passed, then just sort via filteredData.options
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
