import {
  DefaultValues,
  CourierData,
  SingleFormatedItem,
  CouriersNames,
  DefaultData,
} from "../../types";
import {courierNameF, serviceNameF, deliveryTimeF, VARIABLES} from "../../utils";

const {
  PARCEL2GO_LOGO_SRC,
  PARCEL_MONKEY_LOGO_SRC,
  PARCEL_MONKEY,
  PARCEL2GO,
  P4D,
  P4D_LOGO_SRC,
  PARCELBROKER,
  PARCELBROKER_LOGO_SRC,
} = VARIABLES;

export interface Initial_State_Main {
  couriersData: (values: DefaultValues) => CourierData[];
  couriersNamesArr: CouriersNames[];
  currentValues: DefaultValues;
  fetchCounter: number;
  allRes: SingleFormatedItem[];
  valueClickedBtn: string;
  isClickedBtn: Boolean;
  tempController: {abort: () => void};
  defaultData: DefaultData;
  error: {message: string; stack: string};
}
//1.0
export const handleFetchNewData = (
  tempController: {abort: () => void},
  dispatch: React.Dispatch<{
    type: string;
    payload?: any;
  }>,
  couriersData: (values: DefaultValues) => CourierData[],
  currentValues: DefaultValues,
  setController: React.Dispatch<React.SetStateAction<AbortController>>
) => {
  const controller = new AbortController();
  const {signal} = controller;
  setController(controller);

  //for any new fetch I need to cancell all current fetching in asyc functions
  //I checking if there is any of them, I need to cancel that one
  if (tempController) tempController.abort();
  dispatch({type: "SET_TEMP_CONTROLLER", payload: controller});

  //1.1
  fetchDataFromAllCouriers(signal, dispatch, couriersData, currentValues);
  return () => {
    controller.abort();
  };
};
//1.1
export const fetchDataFromAllCouriers = async (
  signal: AbortSignal,
  dispatch: React.Dispatch<{
    type: string;
    payload?: any;
  }>,
  couriersData: (values: DefaultValues) => CourierData[],
  currentValues: DefaultValues
) => {
  //every time when starting fetching new data, reset to default values
  dispatch({type: "SET_TO_DEFAULT_FETCH_COUNTER"});
  dispatch({type: "SET_TO_DEFAULT_ALL_RES"});

  //I might use Promise.all() but I want to do display new results after each response
  couriersData(currentValues).forEach(async (courierData: CourierData) => {
    //1.2
    const data = await getData(courierData, signal);
    //todo: Change to try/catch and then prompt error if occured
    //1.3
    const formatedData = formattingData(
      courierData.names.companyName,
      data,
      currentValues
    );

    dispatch({type: "SET_ALL_RESPONSES", payload: formatedData});
    dispatch({type: "INCREASE_FETCH_COUNTER_BY_1"});
  });
};
//1.2
export const getData = async (courierData: CourierData, signal: AbortSignal) => {
  let optionsData = {};
  if (courierData.getToken) {
    const optionsToken = {
      ...courierData.getToken.options,
      ...{url: courierData.getToken.url},
    };
    //1.2.1
    const tokken = await fetching(courierData.names.apiUrl, {
      method: "POST",
      body: JSON.stringify(optionsToken),
      headers: {
        "Content-Type": "application/json",
      },
      signal,
    });
    optionsData = {
      ...courierData.getData.options,
      headers: {
        ...courierData.getData.options.headers,
        Authorization: `Bearer ${tokken.access_token}`,
      },
      ...{url: courierData.getData.url},
    };
  }

  optionsData = {
    ...courierData.getData.options,
    ...{url: courierData.getData.url},
    ...optionsData,
  };

  //1.2.1
  return await fetching(courierData.names.apiUrl, {
    method: "POST",
    body: JSON.stringify(optionsData),
    headers: {
      "Content-Type": "application/json",
    },
    signal,
  });
};

//1.2.1
export const fetching = async (
  url: string,
  options: {
    method: string;
    body: string;
    headers: {"Content-Type": string};
    signal: AbortSignal;
  }
) => {
  return await fetch(url, options)
    .then((res) => res.json())
    .then((body) => body)
    .catch((error) => {
      // console.log("Server failed to return data: " + error);
      return error;
    });
};

// const isUniqueObjectFromArray = (
//   objectToCheck: SingleFormatedItem,
//   arrayData: SingleFormatedItem[]
// ) =>
//   !arrayData.some(
//     (ele) =>
//       ele.companyName === objectToCheck.companyName &&
//       ele.courierName === objectToCheck.courierName &&
//       ele.serviceName === objectToCheck.serviceName &&
//       ele.price === objectToCheck.price &&
//       ele.deliveryTime === objectToCheck.deliveryTime
//   );

//1.3
export const formattingData = (
  companyName: string,
  //data is any due to unkonow respond from server
  data: any,
  dimension: DefaultValues
): SingleFormatedItem[] => {
  const {WEIGHT, LENGTH, WIDTH, HEIGHT} = dimension;
  switch (companyName) {
    case PARCEL2GO:
      interface PARCEL2GO_Item {
        Service: {CourierName: string; Name: string; Classification: string};
        TotalPrice: number;
      }

      return data.Quotes.map((item: PARCEL2GO_Item) => {
        const courierName = courierNameF(item.Service.CourierName, companyName);
        const serviceName = serviceNameF(item.Service.Name, companyName);
        const deliveryTime = deliveryTimeF(item.Service.Classification, companyName);
        const price = item.TotalPrice.toFixed(2);
        const logoSrc = PARCEL2GO_LOGO_SRC;
        const url = `https://www.parcel2go.com/quotes?col=219&dest=219&mdd=0&mode=Default&p=1~${WEIGHT}|${LENGTH}|${WIDTH}|${HEIGHT}&quoteType=Default`;
        return {
          companyName,
          courierName,
          serviceName,
          price,
          deliveryTime,
          url,
          logoSrc,
        };
      });

    case PARCEL_MONKEY:
      interface PARCEL_MONKEY_Item {
        carrier: string;
        service: string;
        service_name: string;
        total_price_gross: string;
      }

      return data.map((item: PARCEL_MONKEY_Item) => {
        const courierName = courierNameF(item.carrier, companyName);
        const serviceName = serviceNameF(item.service, companyName);
        const deliveryTime = deliveryTimeF(item.service_name, companyName);
        const price = item.total_price_gross;
        const logoSrc = PARCEL_MONKEY_LOGO_SRC;
        const url = "https://www.parcelmonkey.co.uk/";
        return {
          companyName,
          courierName,
          serviceName,
          price,
          deliveryTime,
          url,
          logoSrc,
        };
      });

    case P4D:
      interface P4D_Item {
        courierName: string;
        serviceName: string;
        deliveryTime: string;
        price: string;
      }
      const extractCourierNameFromImgSrc = (str: string) => {
        if (str?.length) {
          const lastSlashIndex = str.lastIndexOf("/");
          const dotIndex = str.lastIndexOf(".");
          return str.substring(lastSlashIndex + 1, dotIndex);
        } else return str;
      };

      const getPrice = (str: string) => {
        const poundIndex = str.indexOf("£");
        if (str.indexOf("£") !== -1) return str.substring(poundIndex + 1);
      };

      return data.map((item: P4D_Item) => {
        const courierName = courierNameF(
          extractCourierNameFromImgSrc(item.courierName),
          companyName
        );
        const serviceName = serviceNameF(item.serviceName + courierName, companyName);
        const deliveryTime = deliveryTimeF(item.deliveryTime, companyName);
        const price = getPrice(item.price);
        const logoSrc = P4D_LOGO_SRC;
        const url = `https://app.p4d.co.uk/quotes/GB:RM191ZY/GB:RM191ZY/${WEIGHT},${LENGTH},${WIDTH},${HEIGHT}?type=Domestic&rank=four`;

        return {
          companyName,
          courierName,
          serviceName,
          price,
          deliveryTime,
          logoSrc,
          url,
        };
      });
    case PARCELBROKER:
      interface PARCELBROKER_Item {
        fullServiceName: string;
        courierName: string;
        serviceName: string;
        deliveryTime: string;
        price: string;
      }

      return data.map((item: PARCELBROKER_Item) => {
        const courierName = courierNameF(item.courierName, companyName);
        const serviceName = serviceNameF(item.fullServiceName, companyName);
        const deliveryTime = deliveryTimeF(item.deliveryTime, companyName);
        const price = item.price;
        const logoSrc = PARCELBROKER_LOGO_SRC;
        const url = "https://parcelbroker.co.uk/";
        return {
          companyName,
          courierName,
          serviceName,
          price,
          deliveryTime,
          url,
          logoSrc,
        };
      });

    default:
      return [];
  }
};
