// const getApiUrl = require("./getApiUrl");
// import getApiUrl from "./getApiUrl";
const couriersNamesArr = [
  {apiUrl: "/api/parcelmonkey/", courierName: "parcelmonkey"},
  {apiUrl: "/api/p2g/", courierName: "parcel2go"},
];
const getApiUrl = (courierName) =>
  couriersNamesArr.filter((name) => name.courierName === courierName)[0].apiUrl;

module.exports = {
  couriersNamesArr,
  forFetchingData: [
    {
      apiUrl: getApiUrl("parcel2go"),
      getToken: {
        url: "https://www.parcel2go.com/auth/connect/token",
        options: {
          method: "POST",
          headers: {
            Accept: "*/*",
            "User-Agent": "insomnia/5.14.6",
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: `grant_type=client_credentials&scope=public-api%20payment&client_id=${process.env.REACT_APP_P2G_CLIENT_ID}&client_secret=${process.env.REACT_APP_P2G_CLIENT_SECRET}`,
        },
      },
      getData: {
        url: "https://www.parcel2go.com/api/quotes",
        options: {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "*/*",
            "User-Agent": "insomnia/5.14.6",
            //needs to be passed tokken from fetching using getToken object
            //Authorization: `Bearer ${tokkenP2G}`,
            Authorization: `Bearer tokken`,
          },
          body: JSON.stringify({
            CollectionAddress: {
              Country: "GBR",
            },
            DeliveryAddress: {
              Country: "GBR",
            },
            Parcels: [
              {
                Value: 0,
                Weight: 10,
                Length: 10,
                Width: 10,
                Height: 10,
              },
            ],
          }),
        },
      },
    },
    {
      apiUrl: getApiUrl("parcelmonkey"),
      getData: {
        url: "https://api.parcelmonkey.co.uk/GetQuote",
        options: {
          method: "POST",
          headers: {
            apiversion: process.env.REACT_APP_PARCELMONKEY_APIVERSION,
            userid: process.env.REACT_APP_PARCELMONKEY_USER_ID,
            token: process.env.REACT_APP_PARCELMONKEY_API_KEY,
          },
          body: JSON.stringify({
            origin: "GB",
            destination: "GB",
            boxes: [
              {
                length: 10,
                width: 10,
                height: 10,
                weight: 10,
              },
            ],
            goods_value: 0,
            // sender: {
            //   name: "Rich",
            //   phone: "01234567890",
            //   address1: "Unit 21 Tollgate",
            //   town: "purfleet",
            //   county: "essex",
            //   postcode: "RM19 1ZY",
            // },
            // recipient: {
            //   name: "Nicola",
            //   phone: "01234567890",
            //   email: "nicola@example.com",
            //   address1: "2 Baker's Yard",
            //   address2: "",
            //   town: "purfleet",
            //   county: "essex",
            //   postcode: "RM19 1ZY",
            // },
          }),
        },
      },
    },
  ],
};
