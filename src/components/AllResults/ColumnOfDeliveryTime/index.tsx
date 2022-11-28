import React from "react";
import Prices from "./Prices";
import {VARIABLES} from "../../../utils/variables";
import {TimeSpeedData} from "../../../utils/couriersFetchData";

const {FAST, MEDIUM, SLOW, SMALL, LARGE, ALL} = VARIABLES;

const ColumnOfDeliveryTime = ({
  timeSpeedData,
  screenSize,
  columnGap,
}: {
  timeSpeedData: TimeSpeedData[];
  screenSize: string;
  columnGap: number;
}) => {
  const width = (): string => {
    if (screenSize === LARGE || screenSize === SMALL) return "100%";
    else {
      // if (screenSize === MEDIUM) return `calc(50% - ${columnGap / 2}px)`;
      return `calc(50% - ${columnGap / 2}px)`;
    }
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
