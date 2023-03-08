import React from "react";
import Prices from "./Prices";
import {VARIABLES} from "../../../utils/variables";
import {TimeSpeedData} from "../../../utils/couriersFetchData";
import "./style.scss";

const SingleResult = ({timeSpeedData}: {timeSpeedData: any}) => {
  return (
    <tr className="SingleColumn">
      {timeSpeedData?.map((service: any) => {
        // console.log(`timeSpeedData:`, timeSpeedData);
        return (
          <td key={service.id} className="SingleColumn-SingleResult">
            <div>
              <img alt="DPD Collection" src="./dpd.svg"></img>
              <span>service:</span>
              <span style={{background: "lightgreen"}}>{service.serviceName}</span>
            </div>
            <Prices serviceData={service.serviceData} />
          </td>
        );
      })}
    </tr>
  );
};

export default SingleResult;
