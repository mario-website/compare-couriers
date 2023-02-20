import React from "react";
import Prices from "./Prices";
import {VARIABLES} from "../../../utils/variables";
import {TimeSpeedData} from "../../../utils/couriersFetchData";
import "./style.scss";

const {FAST, MEDIUM, SLOW, SMALL, LARGE, ALL} = VARIABLES;

const ColumnOfDeliveryTime = ({
  timeSpeedData,
  screenSize,
}: {
  timeSpeedData: TimeSpeedData[];
  screenSize: string;
}) => {
  const width = (): string => {
    if (screenSize === LARGE || screenSize === SMALL) return "100%";
    else {
      // if (screenSize === MEDIUM) return `calc(50% - ${columnGap / 2}px)`;
      // return `calc(50% - ${columnGap / 2}rem)`;
      return "";
    }
  };

  return (
    <>
      {timeSpeedData.map((service) => {
        return (
          <article key={service.id} className={screenSize === MEDIUM ? "mediu" : ""}>
            <div>
              <span>service:</span>
              <span style={{background: "lightgreen"}}>{service.serviceName}</span>
            </div>
            <Prices serviceData={service.serviceData} />
          </article>
        );
      })}
    </>
  );
};

export default ColumnOfDeliveryTime;
