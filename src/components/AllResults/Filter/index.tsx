import React, {useState, useEffect, useReducer} from "react";

import {VARIABLES} from "../../../utils/variables";
import {TimeSpeedData, DefaultData} from "../../../utils/couriersFetchData";
import "./style.scss";

const {FAST, MEDIUM, SLOW, SMALL, LARGE, ALL} = VARIABLES;

const Filter = ({
  setSorting,
  fetchCounter,
  currentSortingValues,
  screenSize,
  workingData,
  handleDeliveryTime,
  delTime,
}: {
  setSorting: (item: string) => void;
  fetchCounter: number;
  currentSortingValues: {sortedBy: string; isAscending: boolean; deliveryTimeBtn: string};
  screenSize: string;
  workingData: DefaultData;
  handleDeliveryTime: (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    deliveryTimeBtn: string
  ) => void;
  delTime: (time: string) => string | undefined;
}) => {
  return (
    <div className="Filter">
      <div>
        <button onClick={() => setSorting("price")}>sortByPrice</button>
        <button onClick={() => setSorting("alphabetical")}>sortByServiceName</button>
      </div>
      <div>
        <span>fetchCounter:{fetchCounter}</span>
        <div>sortedBy: {currentSortingValues.sortedBy}</div>
        <div>isAscending: {currentSortingValues.isAscending.toString()}</div>
      </div>
      {(screenSize === SMALL || screenSize === MEDIUM) && (
        <div className="Results-FilterButtons">
          {/* to show buttons deliveryTimeBtn */}
          {workingData.mergedAllData?.map((timeSpeed) => {
            const deliveryTimeBtn = timeSpeed.deliveryTime;
            const currentLength = timeSpeed.timeSpeedData.length;
            const minPrice = timeSpeed.minPrice.toFixed(2);
            return (
              <button
                key={timeSpeed.id}
                className={getClassName(
                  deliveryTimeBtn === workingData.options.deliveryTimeBtn,
                  "Results-FilterButtons_isSelected"
                )}
                onClick={(e) => handleDeliveryTime(e, deliveryTimeBtn)}>
                <p>{delTime(deliveryTimeBtn)}</p>
                <p>
                  {currentLength} FROM £{minPrice}
                </p>
              </button>
            );
          })}

          {/* to show how many services */}
          {workingData.titles?.map((title, index) => {
            const allTimeSpeedArray = workingData.mergedAllData.find(
              (e) => e.deliveryTime === ALL
            );

            let showingCount = 0;

            workingData.data?.forEach((workingDataEle, i) => {
              showingCount = showingCount + workingDataEle.timeSpeedData.length;
            });

            const allItemsCount = allTimeSpeedArray?.timeSpeedData.length;
            const isTrue = showingCount !== allItemsCount;
            if (isTrue) {
              return (
                <p key={index + title}>
                  Showing {showingCount} of {allItemsCount} Services
                </p>
              );
            } else {
              return <p key={index + title}>Showing {showingCount} Services</p>;
            }
          })}
        </div>
      )}
    </div>
  );
};

export default Filter;

const getClassName = (isTrue: boolean, className: string) => {
  if (isTrue) return className;
};
