import React, {useState, useEffect, useRef, useReducer, useMemo} from "react";
import {ACTION_TYPES, COURIER_NAMES, VARIABLES} from "../store/postActionTypes";
import {INITIAL_STATE, postReducer} from "../store/postReducer";
import normalizerNames from "../store/normalizerNames";
import {dynamicSort} from "../store/functions";
import {getData, formattingData, setNewData} from "./functions";

const Table = () => {
  const {PARCEL_MONKEY, PARCEL2GO} = COURIER_NAMES;
  const {SLOW, MEDIUM, FAST} = VARIABLES;
  const [data, setData] = useState([]);
  const [state, dispatch] = useReducer(postReducer, INITIAL_STATE);
  const [allResponses, setAllResponses] = useState([]);
  const [fetchCounter, setFetchCounter] = useState(0);
  const [tempController, setTempController] = useState();

  const fetchDataFromAllCouriers = async (signal) => {
    // console.log(`state:`, state);
    setFetchCounter(0);
    setAllResponses([]);
    setData([]);

    state.forFetchingData.forEach(async (courierData) => {
      //todo: Change to try/catch and then prompt error if occured
      const data = await getData(courierData, signal);
      // console.log(`data:`, data);
      const companyName = courierData.names.companyName;
      const formatedData = formattingData(companyName, data, state.defaultValues);
      // console.log(`formatedData:`, formatedData);

      setAllResponses((prev) => {
        const tempAllRes = [...prev, ...formatedData];
        const newData = setNewData(tempAllRes, formatedData);
        // console.log(`newData:`, newData);
        setData(newData);
        return tempAllRes;
      });
      setFetchCounter((prev) => prev + 1);
    });
  };

  useEffect(() => {
    if (allResponses.length > 0) {
      // console.log(`allResponses:`, allResponses);
    }
  }, [allResponses]);

  const handleClick = () => {
    const controller = new AbortController();
    const {signal} = controller;

    //so for any new fetch I need to cancell all current fetching in asyc functions
    //so I checking if there is any of them, I need to cancel that one
    if (tempController) tempController.abort();

    setTempController(controller);
    fetchDataFromAllCouriers(signal);
    console.log("fired");
    return () => {
      controller.abort();
    };
  };

  const sortByPrice = () => {
    const tempData = [...data];
    tempData.forEach((timeSpeed) => {
      //for every time, when clicked button "sortByPrice",
      //value "isAscending" is reversed and stored in object
      // console.log(`timeSpeed:`, timeSpeed);
      // timeSpeed.forEach((timeS) => {
      //   if (timeS.ascendingBy.isPriceAscending) {
      //   }
      // });
      let isAscending = true;

      if (timeSpeed.sortedBy.includes("price")) {
        if (timeSpeed.sortedBy[0] === "-") {
          timeSpeed.sortedBy = "price";
        } else {
          isAscending = false;
          timeSpeed.sortedBy = "-price";
        }
      } else {
        timeSpeed.sortedBy = "price";
      }

      //for every time, when clicked button "sortByPrice",
      //value "isAscending" is reversed and stored in object
      const {timeSpeedData} = timeSpeed;
      timeSpeedData.sort(dynamicSort(isAscending ? "min" : "-min"));
      timeSpeedData.forEach((speedData) => {
        speedData.serviceData.sort(dynamicSort(isAscending ? "price" : "-price"));
      });
    });
    console.log(`tempData:`, tempData);
    setData(tempData);
  };

  const sortByName = () => {
    const tempData = [...data];
    tempData.forEach((timeSpeed) => {
      //for every time, when clicked button "sortByPrice",
      //value "isAscending" is reversed and stored in object
      // console.log(`timeSpeed:`, timeSpeed);
      // timeSpeed.forEach((timeS) => {
      //   if (timeS.ascendingBy.isPriceAscending) {
      //   }
      // });
      let isAscending = true;
      if (timeSpeed.sortedBy.includes("alphabetical")) {
        if (timeSpeed.sortedBy[0] === "-") {
          timeSpeed.sortedBy = "alphabetical";
        } else {
          isAscending = false;
          timeSpeed.sortedBy = "-alphabetical";
        }
      } else {
        timeSpeed.sortedBy = "alphabetical";
      }

      //for every time, when clicked button "sortByPrice",
      //value "isAscending" is reversed and stored in object
      timeSpeed.timeSpeedData.sort(
        dynamicSort(isAscending ? "serviceName" : "-serviceName")
      );
      // timeSpeedData.forEach((speedData) => {
      //   speedData.sort(dynamicSort(isAscending ? "serviceName" : "-serviceName"));
      // });
    });
    setData(tempData);
    console.log(`tempData:`, tempData);
  };

  return (
    <div className="Table">
      <button onClick={handleClick}>get data</button>
      <button onClick={sortByPrice}>sortByPrice</button>
      <button onClick={sortByName}>sortByName</button>
      <span>fetchCounter:{fetchCounter}</span>
      <div style={{display: "flex", columnGap: "20px"}}>
        {data.map((timeSpeed) => {
          return (
            <div
              key={timeSpeed.id}
              className={timeSpeed.deliveryTime}
              style={{display: "flex", flexDirection: "column"}}>
              {timeSpeed.deliveryTime}
              {timeSpeed.timeSpeedData.map((service) => {
                return (
                  <div
                    key={service.id}
                    className={service.serviceName}
                    style={{margin: "0 0 10px 0", border: "1px solid black"}}>
                    <div>
                      <span>service:</span>
                      <span style={{background: "lightgreen"}}>
                        {service.serviceName}
                      </span>
                    </div>
                    {service.serviceData.map((company) => {
                      return (
                        <div key={company.id} style={{background: "lightblue"}}>
                          <span>{company.companyName}</span>
                          <span>price: {company.price}</span>
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
      {state.loading && <p>state.loading:{state.loading}</p>}
      {Object.keys(state.post).length > 0 && <p>data received</p>}
      {state.error !== false && (
        <p>
          error message{state.error.message}, error stack{state.error.stack}
        </p>
      )}
    </div>
  );
};

export default Table;
