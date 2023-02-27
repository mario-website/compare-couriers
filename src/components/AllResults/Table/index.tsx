import React, {useEffect, useState} from "react";
import {DefaultData, TimeSpeedData} from "../../../utils/couriersFetchData";
import SingleResult from "../SingleResult";

const Table = ({workingData, delTime}: {workingData: DefaultData; delTime: any}) => {
  return (
    <table className="Results-Table">
      <thead>
        <tr className="Results-Table_titles">
          {workingData.titles?.map((timeSpeed) => {
            return (
              <th
                key={"title" + timeSpeed}
                className="Results-Table_titles_title"
                colSpan={workingData.titles.length > 1 ? 1 : 2}>
                {delTime(timeSpeed)}
              </th>
            );
          })}
        </tr>
      </thead>
      <tbody className="Results-Table_allItems">
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
