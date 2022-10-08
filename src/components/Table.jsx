import React, {useState, useEffect, useRef, useReducer, useMemo} from "react";
import {ACTION_TYPES, COURIER_NAMES, VARIABLES} from "../store/postActionTypes";
import {INITIAL_STATE, postReducer} from "../store/postReducer";
import normalizerNames from "../store/normalizerNames";
import {dynamicSort} from "../store/functions";

const Table = () => {
  const {PARCEL_MONKEY, PARCEL2GO} = COURIER_NAMES;
  const {SLOW, MEDIUM, FAST} = VARIABLES;
  const [data, setData] = useState([]);
  const [state, dispatch] = useReducer(postReducer, INITIAL_STATE);
  const [allResponses, setAllResponses] = useState([
    {SLOW: []},
    {MEDIUM: []},
    {FAST: []},
  ]);
  const [fetchCounter, setFetchCounter] = useState(0);

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

  const fetchDataFromAllCouriers = async (signal) => {
    // console.log(`state:`, state);
    setFetchCounter(0);
    setAllResponses([{SLOW: []}, {MEDIUM: []}, {FAST: []}]);
    setData([]);

    state.forFetchingData.forEach(async (courierData) => {
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
      // console.log(`data:`, data);
      const companyName = courierData.names.companyName;
      const formatedData = formattingData(companyName, data);
      // console.log(`formatedData:`, formatedData);

      const allServices = [];
      const allSpeed = [];
      formatedData.forEach((e) => {
        if (!allServices.includes(e.serviceName)) {
          allServices.push(e.serviceName);
        }
        if (!allSpeed.includes(e.deliveryTime)) {
          allSpeed.push(e.deliveryTime);
        }
        // {service: e.serviceName}
      });

      const sortedData = sortingData(formatedData);
      setAllResponses((prev) => {
        const out = [];
        const jonedArr = [
          {
            SLOW: [
              ...prev.find((e) => e.SLOW).SLOW,
              ...sortedData.find((e) => e.SLOW).SLOW,
            ],
          },
          {
            MEDIUM: [
              ...prev.find((e) => e.MEDIUM).MEDIUM,
              ...sortedData.find((e) => e.MEDIUM).MEDIUM,
            ],
          },
          {
            FAST: [
              ...prev.find((e) => e.FAST).FAST,
              ...sortedData.find((e) => e.FAST).FAST,
            ],
          },
        ];
        // console.log(`jonedArr:`, jonedArr);
        allSpeed.forEach((e, i) => {
          if (e !== "") {
            const qq = [];
            jonedArr.forEach((rr) => {
              if (Object.keys(rr)[0] === e) {
                qq.push(Object.values(rr));
              }
            });
            const fi = qq[0][0].filter((ee) => ee.deliveryTime === e);
            const allSer = [];

            fi.forEach((ee) => {
              if (!allSer.includes(ee.serviceName) && ee.serviceName !== "")
                allSer.push(ee.serviceName);
            });
            const q = allSer.map((ee) => {
              const data = fi.filter((eee) => eee.serviceName === ee);
              data.sort(dynamicSort(`price`));
              const min = Math.min(...data.map((item) => item.price));
              const max = Math.max(...data.map((item) => item.price));
              return {
                min,
                max,
                data,
                service: ee,
              };
            });
            // console.log(`q:`, q);
            const minPrice = Math.min(...q.map((item) => item.min));
            const maxPrice = Math.max(...q.map((item) => item.max));
            q.sort(dynamicSort(`min`));
            out.push({
              [e]: q,
              minPrice,
              maxPrice,
            });
          }
        });
        // console.log(`out:`, out);
        setData(out);
        return jonedArr;
      });
      setFetchCounter((prev) => prev + 1);
    });
  };

  const sortingData = (formatedData) => {
    const out = [{SLOW: []}, {MEDIUM: []}, {FAST: []}];
    formatedData.forEach((e) => {
      if (e.deliveryTime === FAST) {
        const arr = out.find((e) => e.FAST).FAST;
        arr.push(e);
      }
      if (e.deliveryTime === MEDIUM) {
        const arr = out.find((e) => e.MEDIUM).MEDIUM;
        arr.push(e);
      }
      if (e.deliveryTime === SLOW) {
        const arr = out.find((e) => e.SLOW).SLOW;
        arr.push(e);
      }
    });
    return out;
  };
  const formattingData = (companyName, data) => {
    const formatedData = [];
    switch (companyName) {
      case PARCEL2GO:
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

          formatedData.push({
            companyName,
            courierName,
            serviceName,
            price,
            deliveryTime,
          });
        });
        break;

      case PARCEL_MONKEY:
        data.forEach((item) => {
          const courierName = normalizerNames.courierName(item.carrier, companyName);
          const serviceName = normalizerNames.serviceName(item.service, companyName);
          const deliveryTime = normalizerNames.deliveryTime(
            item.service_name,
            companyName
          );
          const price = item.total_price_gross;
          formatedData.push({
            companyName,
            courierName,
            serviceName,
            price,
            deliveryTime,
          });
        });
        break;

      default:
        break;
    }
    return formatedData;
  };

  // useEffect(() => {
  //   const controller = new AbortController();
  //   const signal = controller.signal;
  //   fetchDataFromAllCouriers(signal);
  //   return () => {
  //     controller.abort();
  //   };
  // }, []);

  useEffect(() => {
    if (allResponses.length > 0) {
      // console.log(`allResponses:`, allResponses);
    }
  }, [allResponses]);
  const [tempController, setTempController] = useState();

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
  const [isPriceAsc, setIsPriceAsc] = useState(false);

  const sortByPrice = () => {
    const tempData = [...data];
    tempData.forEach((e) => {
      Object.values(e)[0].sort(dynamicSort(`${isPriceAsc ? "min" : "-max"}`));
    });
    setIsPriceAsc((prev) => !prev);
    setData(tempData);
  };

  return (
    <div className="Table">
      <button onClick={handleClick}>get data</button>
      <button onClick={sortByPrice}>sortByPrice</button>
      <span>fetchCounter:{fetchCounter}</span>
      <div style={{display: "flex", columnGap: "20px"}}>
        {data.map((res, i) => {
          // console.log(`res:`, Object.values(res)[0][0]?.deliveryTime);
          // console.log(`res:`, res);
          return (
            <div
              key={i}
              className={Object.keys(res)[0]}
              style={{display: "flex", flexDirection: "column"}}>
              {Object.keys(res)[0]}
              {Object.values(res)[0].map((e, ii) => {
                // console.log(`e:`, e);
                return (
                  <div key={ii} className={ii}>
                    <div>
                      <span>service:</span>
                      <span style={{background: "lightgreen"}}>{e.service}</span>
                    </div>
                    {e.data.map((ee, iii) => {
                      return (
                        <div key={iii} style={{background: "lightblue"}}>
                          <span>{ee.companyName}</span>
                          <span>price: {ee.price}</span>
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
