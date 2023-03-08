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
          <li key={company.id}>
            <span>{company.companyName}</span>
            <span>price: {company.price}</span>
          </li>
        );
      })}
    </>
  );
};

export default Prices;
