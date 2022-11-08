import React from "react";
import Prices from "./Prices/Prices";
import {VARIABLES} from "../../../../store/variables";

const {FAST, MEDIUM, SLOW, SMALL, LARGE, ALL} = VARIABLES;

const ColumnOfDeliveryTime = ({timeSpeedData, screenSize, columnGap}) => {
  const width = () => {
    if (screenSize === MEDIUM) return `calc(50% - ${columnGap / 2}px)`;
    if (screenSize === LARGE || screenSize === SMALL) return "100%";
  };
  return (
    <>
      {timeSpeedData.map((service) => {
        return (
          <div
            key={service.id}
            className={service.serviceName}
            style={{
              margin: "0 0 10px 0",
              border: "1px solid black",
              width: width(),
              boxSizing: "border-box",
            }}>
            <div>
              <span>service:</span>
              <span style={{background: "lightgreen"}}>{service.serviceName}</span>
            </div>
            <Prices serviceData={service.serviceData} />
          </div>
        );
      })}
    </>
  );
};

export default ColumnOfDeliveryTime;
