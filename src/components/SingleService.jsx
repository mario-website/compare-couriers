import React, {useState, useEffect, useRef, useReducer} from "react";
import AllPricesInThisService from "./AllPricesInThisService";

const SingleService = ({data}) => {
  return (
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
                    <span style={{background: "lightgreen"}}>{service.serviceName}</span>
                  </div>
                  <AllPricesInThisService serviceData={service.serviceData} />
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
};

export default SingleService;
