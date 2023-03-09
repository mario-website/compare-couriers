import React, {useState} from "react";
import Prices from "./Prices";
import {VARIABLES} from "../../../utils/variables";
import {TimeSpeedData} from "../../../utils/couriersFetchData";
import "./style.scss";

const TableRow = ({timeSpeedData}: {timeSpeedData: any}) => {
  return (
    <tr className="TableRow">
      {timeSpeedData?.map((service: any) => {
        // console.log(`timeSpeedData:`, timeSpeedData);
        // console.log(`service:`, service);
        // console.log(`service.serviceData[0]:`, service.serviceData[0]);
        const numOfServicesFound = service.serviceData.length;
        // const price =
        return (
          <td key={service.id} className="TableRow-SingleResult">
            <div className="TableRow-SingleResult_content">
              <figure>
                <img alt={service.courierName} src={`./${service.courierName}.svg`}></img>
                <figcaption>{service.serviceName}</figcaption>
              </figure>
            </div>
            <div className="TableRow-SingleResult_allPrices ">
              <p>
                <span>
                  {service.serviceData[0].companyName.toLowerCase()} £
                  {service.serviceData[0].price}
                </span>
                <a href={service.serviceData[0].url} target="_blank" rel="noreferrer">
                  <button>Get Deal</button>
                </a>
              </p>
              {numOfServicesFound > 1 && (
                <details>
                  <summary>
                    <span>All {numOfServicesFound} deals:</span>
                  </summary>
                  <ul className="TableRow-SingleResult_price">
                    <Prices serviceData={service.serviceData} />
                  </ul>
                </details>
              )}
            </div>
          </td>
        );
      })}
    </tr>
  );
};

export default TableRow;
