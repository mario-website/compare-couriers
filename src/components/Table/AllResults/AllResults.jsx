import React from "react";
import SingleService from "./SingleService/SingleService";

import {VARIABLES} from "../../../store/postActionTypes";

const AllResults = ({data}) => {
  const {FAST, MEDIUM, SLOW} = VARIABLES;
  return (
    <div style={{display: "flex", columnGap: "20px"}}>
      {data.map((timeSpeed) => {
        const delTime = () => {
          if (timeSpeed.deliveryTime === FAST) return "Next Day Delivery";
          if (timeSpeed.deliveryTime === MEDIUM) return "2 Days Delivery";
          if (timeSpeed.deliveryTime === SLOW) return "3 or more Days Delivery";
        };
        return (
          <div
            key={timeSpeed.id}
            className={timeSpeed.deliveryTime}
            style={{display: "flex", flexDirection: "column"}}>
            {delTime()}
            <SingleService timeSpeedData={timeSpeed.timeSpeedData} />
          </div>
        );
      })}
    </div>
  );
};

export default AllResults;
