import React from "react";
import TableRow from "../TableRow";
import "./style.scss";

import {TableProps} from "./types";

const Table = ({workingData, delTime}: TableProps) => {
  return (
    <table className="Table">
      <thead className="Table-Titles">
        <tr>
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
        {workingData.rowsData?.map((timeSpeedRow) => {
          return (
            <TableRow
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
