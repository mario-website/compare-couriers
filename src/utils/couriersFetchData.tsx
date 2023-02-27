import {VARIABLES} from "./variables";
import {convertIso2ToIso3} from "./utils";

const {PARCEL2GO, PARCEL_MONKEY, ALL} = VARIABLES;
export interface DefaultValues {
  VALUE: number;
  WEIGHT: number;
  LENGTH: number;
  WIDTH: number;
  HEIGHT: number;
  IS_ASCENDING: boolean;
  SORTED_BY: string;
  COUNTRY_FROM: string;
  COUNTRY_TO: string;
  POSTCODE_FROM: string;
  POSTCODE_TO: string;
}

export const defaultValues: DefaultValues = {
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

export interface TimeSpeedData {
  id: string;
  min: number | string;
  max: number | string;
  deliveryTime: any;
  serviceData: any;
  serviceName: any;
}

export interface DefaultData {
  rowsData?: any[];
  titles: any[];
  options: {
    sortedBy: string;
    isAscending: boolean;
    deliveryTimeBtn: string;
  };
  data: {
    id: string;
    deliveryTime: string;
    minPrice: number;
    maxPrice: number;
    timeSpeedData: TimeSpeedData[];
  }[];
  mergedAllData: any[];
}

export const defaultData: DefaultData = {
  options: {
    sortedBy: defaultValues.SORTED_BY,
    isAscending: defaultValues.IS_ASCENDING,
    deliveryTimeBtn: ALL,
  },
  data: [],
  titles: [],
  mergedAllData: [],
  rowsData: [],
};
interface CouriersNames {
  apiUrl: string;
  companyName: string;
}
export interface CouriersNamesArr extends Array<CouriersNames> {}

export const couriersNamesArr: CouriersNames[] = [
  {apiUrl: "/api/parcelmonkey/", companyName: PARCEL_MONKEY},
  {apiUrl: "/api/p2g/", companyName: PARCEL2GO},
];

export const getObjName = (companyName: string) =>
  couriersNamesArr.find((name) => name.companyName === companyName);

interface CourierData {
  names: CouriersNames | undefined;
  getToken?: {
    url: string;
    options: {
      method: string;
      headers: {
        Accept: string;
        "User-Agent": string;
        "Content-Type": string;
      };
      body: string;
    };
  };
  getData: {
    url: string;
    options: {
      method: string;
      headers: {};
      body: string;
    };
  };
}

export interface ReturnCouriersData extends Array<CourierData> {}

export const couriersData = (values: DefaultValues) => {
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

  const returnCouriersData: CourierData[] = [
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
  return returnCouriersData;
};
