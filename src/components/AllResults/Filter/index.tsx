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
  const sortByPriceTxt = currentSortingValues.isAscending ? "Low-High" : "High-Low";

  return (
    <div className="Filter">
      {/* <div>
        <span>fetchCounter:{fetchCounter}</span>
        <div>sortedBy: {currentSortingValues.sortedBy}</div>
        <div>isAscending: {currentSortingValues.isAscending.toString()}</div>
      </div> */}
      <div className="Filter-Buttons">
        {screenSize === SMALL || screenSize === MEDIUM ? (
          <>
            <div className={"Filter-DeliveryTime"}>
              <p className={"Filter-DeliveryTime_title"}>View Results By Delivery Day</p>
              {/* to show buttons deliveryTimeBtn */}
              <div className={"Filter-DeliveryTime_allButtons"}>
                {/* {adding extra div helps center and all buttons have the same width} */}
                <div>
                  {workingData.mergedAllData?.map((timeSpeed) => {
                    const deliveryTimeBtn = timeSpeed.deliveryTime;
                    const currentLength = timeSpeed.timeSpeedData.length;
                    const minPrice = timeSpeed.minPrice.toFixed(2);
                    return (
                      <button
                        key={timeSpeed.id}
                        className={`Filter-Button${
                          deliveryTimeBtn === workingData.options.deliveryTimeBtn
                            ? "_isSelected"
                            : ""
                        }`}
                        onClick={(e) => handleDeliveryTime(e, deliveryTimeBtn)}>
                        <p>{delTime(deliveryTimeBtn)}</p>
                        <p>{currentLength} from</p>
                        <p>£{minPrice}</p>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
            <div className={"Filter-Services"}>
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
              <button
                className="Filter-Button_sortBy"
                onClick={() => setSorting("price")}>
                <p>Sort - Price</p>
                <p>{sortByPriceTxt}</p>
              </button>
            </div>
          </>
        ) : (
          <button className="Filter-Button_sortBy" onClick={() => setSorting("price")}>
            <p>Sort - Price</p>
            <p>{sortByPriceTxt}</p>
          </button>
        )}
      </div>
      {/* to show how many services */}
      {/* <div className="lds-roller">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div> */}
    </div>
  );
};

export default Filter;
