const getApiUrl = require("./getApiUrl");

export const couriers = [
  {
    a: process.env.REACT_APP_DB_NAME,
    apiUrl: getApiUrl.getApiUrl("parcel2go"),
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
];
