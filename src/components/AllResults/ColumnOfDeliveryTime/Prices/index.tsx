import React from "react";

interface Props {
  serviceData: []
}

const Prices: React.FC<Props> = ({serviceData}) => {
  interface items {
    companyName: string,
    courierName: string,
    price: string | number,
  }
  return (
    <>
      {serviceData.map((company: items) => {
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
