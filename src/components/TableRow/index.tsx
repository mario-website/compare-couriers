import React from "react";
import Prices from "../Prices";
import {VARIABLES} from "../../utils";
import "./style.scss";

const {PARCEL_MONKEY} = VARIABLES;

const TableRow = ({timeSpeedData}: {timeSpeedData: any}) => {
  return (
    <tr className="TableRow">
      {timeSpeedData?.map((service: any) => {
        const numOfServicesFound = service.serviceData.length;
        const logoSrc = service.serviceData[0].logoSrc;
        const getParcelMonkeyClassName =
          service.serviceData[0].companyName === PARCEL_MONKEY ? "parcelMonkeyBC" : "";

        return (
          <td key={service.id} className="TableRow-SingleResult">
            <div className="TableRow-SingleResult_content">
              <figure>
                <img alt={service.courierName} src={`./${service.courierName}.svg`}></img>
                <figcaption>{service.serviceName}</figcaption>
              </figure>
            </div>
            <div className="TableRow-SingleResult_allPrices">
              <div className="TableRow-SingleResult_allPrices_title">
                <span>
                  <figure>
                    <figcaption>£{service.serviceData[0].price}</figcaption>
                    <img
                      className={getParcelMonkeyClassName}
                      alt={logoSrc}
                      src={`./${logoSrc}`}></img>
                  </figure>
                </span>
                <a href={service.serviceData[0].url} target="_blank" rel="noreferrer">
                  <button>View Deal</button>
                </a>
              </div>
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
