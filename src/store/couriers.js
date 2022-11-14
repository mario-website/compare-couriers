import {VARIABLES} from "./variables";
import {convertIso2ToIso3} from "./functions";

const {PARCEL2GO, PARCEL_MONKEY, ALL} = VARIABLES;

export const defaultValues = {
  VALUE: 0,
  WEIGHT: 10,
  LENGTH: 9,
  WIDTH: 8,
  HEIGHT: 7,
  IS_ASCENDING: true,
  SORTED_BY: "price",
  COUNTRY_FROM: "GB",
  COUNTRY_TO: "GB",
  POSTCODE_FROM: "BL00AA",
  POSTCODE_TO: "BL00AA",
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
  const {
    VALUE,
    WEIGHT,
    LENGTH,
    WIDTH,
    HEIGHT,
    COUNTRY_FROM,
    COUNTRY_TO,
    POSTCODE_FROM,
    POSTCODE_TO,
  } = values;
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
              Country: convertIso2ToIso3(COUNTRY_FROM),
            },
            DeliveryAddress: {
              Country: convertIso2ToIso3(COUNTRY_TO),
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
            origin: COUNTRY_FROM,
            destination: COUNTRY_TO,
            boxes: [
              {
                length: LENGTH,
                width: WIDTH,
                height: HEIGHT,
                weight: WEIGHT,
              },
            ],
            goods_value: 0,
            sender: {
              name: "Rich",
              phone: "01234567890",
              address1: "Unit 21 Tollgate",
              town: "Purfleet",
              county: "essex",
              postcode: POSTCODE_FROM,
            },
            recipient: {
              name: "Nicola",
              phone: "01234567890",
              email: "nicola@example.com",
              address1: "2 Baker's Yard",
              address2: "",
              town: "purfleet",
              county: "essex",
              postcode: POSTCODE_TO,
            },
          }),
        },
      },
    },
  ];
};
