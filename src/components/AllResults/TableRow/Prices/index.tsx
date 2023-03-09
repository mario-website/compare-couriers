import React from "react";

const Prices = ({serviceData}: {serviceData: []}) => {
  interface items {
    companyName: string;
    courierName: string;
    price: string | number;
    id: string;
    url: string;
  }
  return (
    <>
      {serviceData.map((company: items) => {
        return (
          <li key={company.id}>
            <span>{company.companyName.toLowerCase()}</span>
            <span>£{company.price}</span>
            <a href={company.url} target="_blank" rel="noreferrer">
              <button>Get Deal</button>
            </a>
          </li>
        );
      })}
    </>
  );
};

export default Prices;
