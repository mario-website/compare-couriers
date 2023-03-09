import React, {useState} from "react";
import Prices from "./Prices";
import {VARIABLES} from "../../../utils/variables";
import {TimeSpeedData} from "../../../utils/couriersFetchData";
import "./style.scss";

const TableRow = ({timeSpeedData}: {timeSpeedData: any}) => {
  const [openUl, setOpenUl] = useState("visibilityHidden");
  const handleClick = () => {
    console.log("scc");
    // setOpenUl((prev) => {
    //   if (prev === "visibilityHidden") return "visibilityVisible";
    //   else return "visibilityHidden";
    // });
  };
  return (
    <tr className="TableRow">
      {timeSpeedData?.map((service: any) => {
        // console.log(`timeSpeedData:`, timeSpeedData);
        // console.log(`service:`, service);
        return (
          <td key={service.id} className="TableRow-SingleResult">
            <div className="TableRow-SingleResult_content">
              <figure>
                <img alt={service.courierName} src={`./${service.courierName}.svg`}></img>
                <figcaption>{service.serviceName}</figcaption>
              </figure>
              <span>services found: {service.serviceData.length}</span>
              {/* <p>price: {service.serviceData[0].url}</p> */}
            </div>
            <div className="TableRow-SingleResult_allPrices">
              <details>
                <summary onClick={handleClick}>
                  lowest price: {service.serviceData[0].price}
                </summary>
                <ul className={openUl}>
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
