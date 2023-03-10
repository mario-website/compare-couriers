import React from "react";
import {VARIABLES} from "../../../../utils/variables";

const {PARCEL_MONKEY} = VARIABLES;

const Prices = ({serviceData}: {serviceData: []}) => {
  interface items {
    companyName: string;
    courierName: string;
    price: string | number;
    id: string;
    url: string;
    logoSrc: string;
  }
  return (
    <>
      {serviceData.map((company: items) => {
        const getParcelMonkeyClassName =
          company.companyName === PARCEL_MONKEY ? "parcelMonkeyBC" : "";
        return (
          <li key={company.id}>
            <span>
              <figure>
                <figcaption>£{company.price}</figcaption>
                <img
                  className={getParcelMonkeyClassName}
                  alt={company.logoSrc}
                  src={`./${company.logoSrc}`}></img>
              </figure>
            </span>
            <a href={company.url} target="_blank" rel="noreferrer">
              <button>View Deal</button>
            </a>
          </li>
        );
      })}
    </>
  );
};

export default Prices;
