import React from "react";

const Prices = ({serviceData}) => {
  return (
    <>
      {serviceData.map((company) => {
        const id = company.companyName + company.courierName + company.price;
        return (
          <div key={id} style={{background: "lightblue"}}>
            <span>{company.companyName}</span>
            <span>price: {company.price}</span>
          </div>
        );
      })}
    </>
  );
};

export default Prices;
