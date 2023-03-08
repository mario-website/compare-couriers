import React from "react";
import Prices from "./Prices";
import {VARIABLES} from "../../../utils/variables";
import {TimeSpeedData} from "../../../utils/couriersFetchData";
import "./style.scss";

const TableRow = ({timeSpeedData}: {timeSpeedData: any}) => {
  return (
    <tr className="TableRow">
      {timeSpeedData?.map((service: any) => {
        // console.log(`timeSpeedData:`, timeSpeedData);
        console.log(`service:`, service);
        return (
          <td key={service.id} className="TableRow-SingleResult">
            <div>
              <figure>
                <img alt={service.courierName} src={`./${service.courierName}.svg`}></img>
                <figcaption>{service.serviceName}</figcaption>
              </figure>
              <span>services found: {service.serviceData.length}</span>
              {/* <p>price: {service.serviceData[0].url}</p> */}
            </div>
            <div className="TableRow-SingleResult_allPrices">
              <nav role="navigation">
                <ul>
                  <li>
                    <p>lowest price: {service.serviceData[0].price}</p>
                    <ul className="dropdown" aria-label="submenu">
                      <Prices serviceData={service.serviceData} />
                    </ul>
                  </li>
                </ul>
              </nav>
            </div>
          </td>
        );
      })}
    </tr>
  );
};

export default TableRow;
