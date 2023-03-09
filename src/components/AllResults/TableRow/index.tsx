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
        const numOfServicesFound = service.serviceData.length;
        return (
          <td key={service.id} className="TableRow-SingleResult">
            <div className="TableRow-SingleResult_content">
              <figure>
                <img alt={service.courierName} src={`./${service.courierName}.svg`}></img>
                <figcaption>{service.serviceName}</figcaption>
              </figure>
              {/* <p>price: {service.serviceData[0].url}</p> */}
            </div>
            <div className="TableRow-SingleResult_allPrices ">
              <details>
                <summary>
                  <span>
                    Found {numOfServicesFound} deal{numOfServicesFound > 1 && "s"}, from:
                    £{service.serviceData[0].price}
                  </span>
                </summary>
                <ul>
                  <Prices serviceData={service.serviceData} />
                </ul>
              </details>
            </div>
          </td>
        );
      })}
    </tr>
  );
};

export default TableRow;
