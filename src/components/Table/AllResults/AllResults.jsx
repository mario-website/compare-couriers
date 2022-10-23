import React, {useState, useEffect, useLayoutEffect} from "react";
import SingleService from "./SingleService/SingleService";
import {VARIABLES} from "../../../store/postActionTypes";

const AllResults = ({data}) => {
  return (
    <div style={{display: "flex", columnGap: "20px"}}>
      {data.map((timeSpeed) => {
        return (
          <div
            key={timeSpeed.id}
            className={timeSpeed.deliveryTime}
            style={{
              display: "flex",
              flexDirection: "column",
              width: "-webkit-fill-available",
            }}>
            {delTime(timeSpeed.deliveryTime)}
            <SingleService timeSpeedData={timeSpeed.timeSpeedData} />
          </div>
        );
      })}
    </div>
  );
};

export default AllResults;

const {FAST, MEDIUM, SLOW, ALL} = VARIABLES;
const delTime = (time) => {
  if (time === FAST) return "Next Day Delivery";
  if (time === MEDIUM) return "2 Days Delivery";
  if (time === SLOW) return "3 or more Days Delivery";
  if (time === ALL) return "All services";
};
