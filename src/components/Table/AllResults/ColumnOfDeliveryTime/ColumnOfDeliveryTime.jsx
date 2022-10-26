import React from "react";
import Prices from "./Prices/Prices";

const ColumnOfDeliveryTime = ({timeSpeedData}) => {
  return (
    <>
      {timeSpeedData.map((service) => {
        return (
          <div
            key={service.id}
            className={service.serviceName}
            style={{margin: "0 0 10px 0", border: "1px solid black"}}>
            <div>
              <span>service:</span>
              <span style={{background: "lightgreen"}}>{service.serviceName}</span>
            </div>
            <Prices serviceData={service.serviceData} />
          </div>
        );
      })}
    </>
  );
};

export default ColumnOfDeliveryTime;
