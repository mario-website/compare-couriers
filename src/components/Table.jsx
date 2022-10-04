import React, {useState, useEffect, useRef, useReducer} from "react";
import {ACTION_TYPES} from "../store/postActionTypes";
import {INITIAL_STATE, postReducer} from "../store/postReducer";

const Table = () => {
  const [state, dispatch] = useReducer(postReducer, INITIAL_STATE);

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

  const main = async (signal) => {
    console.log(`state:`, state);
    state.couriers.forEach(async (courier) => {
      let tokken = "";
      let optionsData = {};
      if (courier.getToken) {
        const optionsToken = {
          ...courier.getToken.options,
          ...{url: courier.getToken.url},
        };
        tokken = await fetching(courier.apiUrl, {
          method: "POST",
          body: JSON.stringify(optionsToken),
          headers: {
            "Content-Type": "application/json",
          },
          signal,
        });
        optionsData = {
          ...courier.getData.options,
          headers: {
            ...courier.getData.options.headers,
            Authorization: `Bearer ${tokken.access_token}`,
          },
          ...{url: courier.getData.url},
        };
      }

      optionsData = {
        ...courier.getData.options,
        ...{url: courier.getData.url},
        ...optionsData,
      };

      const data = await fetching(courier.apiUrl, {
        method: "POST",
        body: JSON.stringify(optionsData),
        headers: {
          "Content-Type": "application/json",
        },
        signal,
      });
      console.log(`data:`, data);
    });
  };

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;
    main(signal);
    return () => {
      controller.abort();
    };
  }, []);

  return (
    <div className="Table">
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
