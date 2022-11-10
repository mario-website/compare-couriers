import {VARIABLES} from "./variables";
const {PARCEL2GO, PARCEL_MONKEY, ALL} = VARIABLES;

export const defaultValues = {
  VALUE: 0,
  WEIGHT: 10,
  LENGTH: 9,
  WIDTH: 8,
  HEIGHT: 7,
  IS_ASCENDING: true,
  SORTED_BY: "price",
};

export const defaultData = {
  options: {
    sortedBy: defaultValues.SORTED_BY,
    isAscending: defaultValues.IS_ASCENDING,
    deliveryTimeBtn: ALL,
  },
  data: [],
  mergedAllData: [],
};

export const couriersNamesArr = [
  {apiUrl: "/api/parcelmonkey/", companyName: PARCEL_MONKEY},
  {apiUrl: "/api/p2g/", companyName: PARCEL2GO},
];

export const getObjName = (companyName) =>
  couriersNamesArr.find((name) => name.companyName === companyName);

export const couriersData = (values) => {
  const {VALUE, WEIGHT, LENGTH, WIDTH, HEIGHT} = values;
  return [
    {
      names: getObjName(PARCEL2GO),
      getToken: {
        url: "https://sandbox.parcel2go.com/auth/connect/token",
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
                Value: VALUE,
                Weight: WEIGHT,
                Length: LENGTH,
                Width: WIDTH,
                Height: HEIGHT,
              },
            ],
          }),
        },
      },
    },
    {
      names: getObjName(PARCEL_MONKEY),
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
                length: LENGTH,
                width: WIDTH,
                height: HEIGHT,
                weight: WEIGHT,
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
  ];
};
