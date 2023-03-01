import React, {useEffect, useState} from "react";
import {DefaultData, TimeSpeedData} from "../../../utils/couriersFetchData";
import SingleResult from "../SingleResult";
import "./style.scss";

const Table = ({workingData, delTime}: {workingData: DefaultData; delTime: any}) => {
  return (
    <table className="Table">
      <thead>
        <tr className="Table-Titles">
          {workingData.titles?.map((timeSpeed) => {
            return (
              <th
                key={"title" + timeSpeed}
                className="Table-Titles_title"
                //need to find better way to set colSpan value
                colSpan={
                  workingData.titles.length > 1 || workingData.data.length === 1 ? 1 : 2
                }>
                {delTime(timeSpeed)}
              </th>
            );
          })}
        </tr>
      </thead>
      <tbody className="Table-AllItems">
        {workingData.rowsData?.map((timeSpeedRow, i) => {
          return (
            <SingleResult
              key={"allItems" + timeSpeedRow[0].id}
              timeSpeedData={timeSpeedRow}
            />
          );
        })}
      </tbody>
    </table>
  );
};

export default Table;
