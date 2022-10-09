import normalizerNames from "../store/normalizerNames";
import {ACTION_TYPES, COURIER_NAMES, VARIABLES} from "../store/postActionTypes";
import {dynamicSort} from "../store/functions";

const {PARCEL_MONKEY, PARCEL2GO} = COURIER_NAMES;

export const fetching = async (url, options) => {
  // console.log(`url, options:`, url, options);
  const fetchRes = await fetch(url, options)
    .then((res) => res.json())
    .then((body) => {
      // console.log(`body:`, body);
      return body;
    })
    .catch((error) => {
      // console.log("Server failed to return data: " + error);
      return error;
    });
  return fetchRes;
};

export const getData = async (courierData, signal) => {
  let optionsData = {};
  if (courierData.getToken) {
    const optionsToken = {
      ...courierData.getToken.options,
      ...{url: courierData.getToken.url},
    };
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

  const data = await fetching(courierData.names.apiUrl, {
    method: "POST",
    body: JSON.stringify(optionsData),
    headers: {
      "Content-Type": "application/json",
    },
    signal,
  });
  return data;
};

export const formattingData = (companyName, data, dimension) => {
  const formatedData = [];
  switch (companyName) {
    case PARCEL2GO:
      // console.log(`data:`, data);
      data.Quotes.forEach((item) => {
        const courierName = normalizerNames.courierName(
          item.Service.CourierName,
          companyName
        );
        const serviceName = normalizerNames.serviceName(item.Service.Name, companyName);
        const deliveryTime = normalizerNames.deliveryTime(
          item.Service.Classification,
          companyName
        );
        const price = item.TotalPrice.toFixed(2);
        const url = `https://www.parcel2go.com/quotes?col=219&dest=219&mdd=0&mode=Default&p=1~${dimension.weight}|${dimension.length}|${dimension.width}|${dimension.height}&quoteType=Default`;

        formatedData.push({
          companyName,
          courierName,
          serviceName,
          price,
          deliveryTime,
          url,
        });
      });
      break;

    case PARCEL_MONKEY:
      console.log(`data:`, data);
      data.forEach((item) => {
        // console.log(`item:`, item);
        const courierName = normalizerNames.courierName(item.carrier, companyName);
        const serviceName = normalizerNames.serviceName(item.service, companyName);
        const deliveryTime = normalizerNames.deliveryTime(item.service_name, companyName);
        const price = item.total_price_gross;
        const url = "https://www.parcelmonkey.co.uk/";
        formatedData.push({
          companyName,
          courierName,
          serviceName,
          price,
          deliveryTime,
          url,
        });
      });
      break;

    default:
      break;
  }
  return formatedData;
};

export const setNewData = (tempAllRes, formatedData) => {
  //ie. onlyUniqueServicesName = ['DX 24H', 'DHL UK NextDay by 9am'] so 'DX 24H' will not repeat in this array
  const onlyUniqueServicesName = [];

  //like allDelveryTimes = [FAST', 'MEDIUM']
  const allDelveryTimes = [];
  formatedData.forEach((item) => {
    if (!onlyUniqueServicesName.includes(item.serviceName)) {
      onlyUniqueServicesName.push(item.serviceName);
    }
    if (!allDelveryTimes.includes(item.deliveryTime) && item.deliveryTime !== "") {
      allDelveryTimes.push(item.deliveryTime);
    }
    // {service: e.serviceName}
  });
  // console.log(`allDelveryTimes:`, allDelveryTimes);

  // console.log(`onlyUniqueServicesName:`, onlyUniqueServicesName);
  const newData = allDelveryTimes.map((deliveryTime, idDelTime) => {
    const filteredWithDelTime = tempAllRes.filter(
      (singleData) => singleData.deliveryTime === deliveryTime
    );
    const allServicesNames = [];

    filteredWithDelTime.forEach((singleData) => {
      if (
        !allServicesNames.includes(singleData.serviceName) &&
        singleData.serviceName !== ""
      )
        allServicesNames.push(singleData.serviceName);
    });

    const tempData = allServicesNames.map((serviceName, idService) => {
      const data = filteredWithDelTime.filter((item) => item.serviceName === serviceName);
      const dataWithId = data.map((item, id) => {
        return {...item, id};
      });
      dataWithId.sort(dynamicSort("price"));
      const min = Math.min(...dataWithId.map((item) => item.price));
      const max = Math.max(...dataWithId.map((item) => item.price));
      return {
        id: idService,
        isAscending: true,
        min,
        max,
        serviceData: dataWithId,
        serviceName,
      };
    });
    const minPrice = Math.min(...tempData.map((item) => item.min));
    const maxPrice = Math.max(...tempData.map((item) => item.max));

    tempData.sort(dynamicSort("min"));
    return {
      id: idDelTime,
      deliveryTime,
      timeSpeedData: tempData,
      isAscending: true,
      minPrice,
      maxPrice,
    };
  });
  return newData;
};
