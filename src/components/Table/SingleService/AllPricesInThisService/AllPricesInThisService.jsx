import React from "react";

const AllPricesInThisService = ({serviceData}) => {
  return (
    <>
      {serviceData.map((company) => {
        return (
          <div key={company.id} style={{background: "lightblue"}}>
            <span>{company.companyName}</span>
            <span>price: {company.price}</span>
          </div>
        );
      })}
    </>
  );
};

export default AllPricesInThisService;
