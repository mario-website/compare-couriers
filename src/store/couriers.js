// const getApiUrl = require("./getApiUrl");
// import getApiUrl from "./getApiUrl";
const couriersNamesArr = [
  // {apiUrl: "/api/p4d/", courierName: "p4d"},
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
  ],
};
