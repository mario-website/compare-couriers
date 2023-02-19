import React from "react";

const Prices = ({serviceData}: {serviceData: []}) => {
  interface items {
    companyName: string;
    courierName: string;
    price: string | number;
    id: string;
  }
  return (
    <>
      {serviceData.map((company: items) => {
        return (
          <div key={company.id}>
            <span>{company.companyName}</span>
            <span>price: {company.price}</span>
          </div>
        );
      })}
    </>
  );
};

export default Prices;
