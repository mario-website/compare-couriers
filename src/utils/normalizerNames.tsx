import {VARIABLES} from "./variables";
const {SLOW, MEDIUM, FAST} = VARIABLES;
// This is the function which will be called in the main file, which is server.js
// The parameters 'name' and 'surname' will be provided inside the function
// when the function is called in the main file.
// Example: concatenameNames('John,'Doe');

export const courierNameF = (courierName: string, courier: string) => {
  let output = "";

  switch (true) {
    case [
      "Parcelforce 24",
      "Parcelforce by 9am",
      "Parcelforce by 10am",
      "Parcelforce 48",
      "Parcelforce AM",
      "Parcelforce Large",
      "Sunday Delivery",
      "Saturday Delivery",
      "Parcelforce by 12pm",
      "Parcelforce",
    ].includes(courierName):
      output = "Parcelforce";
      break;

    case ["Yodel", "Yodel Direct"].includes(courierName):
      output = "Yodel";
      break;

    case [
      "UPS",
      "ups",
      "UPS Access Point",
      "Express Sameday Collect",
      "UPS Express",
      "UPS carrier",
    ].includes(courierName):
      output = "UPS";
      break;

    case ["TNT"].includes(courierName):
      output = "TNT";
      break;

    case ["Collect+"].includes(courierName):
      output = "Collect+";
      break;

    case ["InPost"].includes(courierName):
      output = "InPost";
      break;

    case ["DX", "DX Freight"].includes(courierName):
      output = "DX";
      break;

    case ["DPD", "dpd", "DPD Collection"].includes(courierName):
      output = "DPD";
      break;

    case ["PalletForce"].includes(courierName):
      output = "PalletForce";
      break;

    case [
      "DHL Express",
      "DHL Express PRE NOON",
      "DHL Express PRE 9AM",
      "DHL",
      "DHL Parcel UK",
      "DHL Parcel",
    ].includes(courierName):
      output = "DHL";
      break;

    case ["Evri Collection", "Evri Drop-off", "Evri ParcelShop Next Day"].includes(
      courierName
    ):
      output = "Evri";
      break;

    case ["Tuffnells"].includes(courierName):
      output = "Tuffnells";
      break;

    case ["FedEx Express", "FedEx"].includes(courierName):
      output = "FedEx";
      break;

    case ["InPost Lockers"].includes(courierName):
      output = "InPost";
      break;

    case ["p4d"].includes(courierName):
      output = "P4D";
      break;

    default:
      console.log("new courierName: ", courierName, courier);
  }

  return output;
};

export const deliveryTimeF = (deliveryTime: string, courier: string) => {
  let output = "";

  if (
    [
      "Fast",
      "Saturday Delivery",
      "Sunday Delivery",
      "DHL Parcel UK",
      "Parcelforce 24",
      "Parcelforce by 9am",
      "Parcelforce by 10am",
      "Parcelforce by 12pm",
      "DHL Parcel Next Day",
      "Next Day before 9am",
      "Next Day before 10.30am",
      "DHL Parcel UK Next Day",
      "Next Day Before 12pm",
      "Next Day Before 10am",
      "DPD Pickup",
      "Next Day Before 9am",
      "Sunday",
      "Saturday",
      "Next working day",
      "DHL Parcel UK Next Day Drop Off",
      "DPD Next Day Collected",
      "DX Next Day",
      "Express 24",
      "Express 9 (by 9)",
      "Express 10 (by 10)",
      "Express AM (by 12)",
      "FedEx Next Day™",
      "1 day",
    ].includes(deliveryTime)
  ) {
    output = FAST;
  }
  if (
    [
      "Parcelforce 48",
      "1-2 days drop off service",
      "Medium",
      "Parcelforce Large",
      "2 working days",
      "Express 48 Large",
      "Express 48",
      "UPS Access Point™",
      "DPD Drop Off",
      "UPS Collected",
    ].includes(deliveryTime)
  ) {
    output = MEDIUM;
  }
  if (["Slow", "Drop Off", "Collected", "Economy Drop-off"].includes(deliveryTime)) {
    output = SLOW;
  }
  if (output === "") {
    console.log("new deliveryTime: ", deliveryTime, courier);
  }
  return output;
};
export const serviceNameF = (serviceName: string, courier: string) => {
  let output = "";

  if (
    serviceName === "Service: access point™ to access point™" ||
    serviceName === "Access Point™ to Access Point™"
  ) {
    output = "Service: access point™ to access point™";
  }
  if (serviceName === "ukparcels_dpddropoff24") {
    output = "Drop off - DPD";
  }
  if (serviceName === "Yodel Northern Ireland") {
    output = "Yodel Northern Ireland";
  }
  if (serviceName === "Yodel Highland and Islands") {
    output = "Yodel Highland and Islands";
  }
  if (
    serviceName === "Parcelforce Worldwide Express 24 Drop Off" ||
    serviceName === "ukparcels_podopf24"
  ) {
    output = "Drop off at post office - Parcelforce Worldwide Express 24";
  }
  if (serviceName === "ukparcels_pfdropoff24") {
    output = "Drop off at depot - Parcelforce Worldwide Express 24";
  }
  if (
    serviceName === "Parcelforce Worldwide Express 48 Drop Off" ||
    serviceName === "ukparcels_podopf48"
  ) {
    output = "Drop off at post office - Parcelforce Worldwide Express 48";
  }
  if (serviceName === "ukparcels_pfdropoff48") {
    output = "Drop off at depot - Parcelforce Worldwide Express 48";
  }
  if (
    serviceName === "Parcelforce Worldwide by 9am" ||
    serviceName === "ukparcels_pf24before0900"
  ) {
    output = "Parcelforce Worldwide by 9am";
  }
  if (serviceName === "ukparcels_podopfby09") {
    output = "Drop off at post office - Parcelforce Worldwide by 9am";
  }
  if (
    serviceName === "Parcelforce Worldwide by 10am" ||
    serviceName === "ukparcels_pf24before1000"
  ) {
    output = "Parcelforce Worldwide by 10am";
  }
  if (serviceName === "ukparcels_podopfby10") {
    output = "Drop off at post office - Parcelforce Worldwide by 10am";
  }
  if (
    serviceName === "Parcelforce Worldwide Express AM" ||
    serviceName === "ukparcels_pf24before1200" ||
    serviceName === "Parcelforce AM"
  ) {
    output = "Parcelforce Worldwide Express AM";
  }
  if (serviceName === "ukparcels_podopfby12") {
    output = "Drop off at post office - Parcelforce Worldwide by 12am";
  }
  if (serviceName === "Parcelforce Worldwide Multi 12 Noon") {
    output = "Parcelforce Worldwide Multi 12 Noon";
  }
  if (serviceName === "Parcelforce Worldwide Large 24") {
    output = "Parcelforce Worldwide Large 24";
  }
  if (
    serviceName === "Parcelforce Worldwide Large 48" ||
    serviceName === "Parcelforce Large"
  ) {
    output = "Parcelforce Worldwide Large 48";
  }
  if (
    serviceName === "Parcelforce Worldwide Express 24" ||
    serviceName === "ukparcels_pf24" ||
    serviceName === "Parcelforce 24"
  ) {
    output = "Parcelforce Worldwide Express 24";
  }
  if (
    serviceName === "Parcelforce Worldwide Express 48" ||
    serviceName === "ukparcels_pf48" ||
    serviceName === "Parcelforce 48"
  ) {
    output = "Parcelforce Worldwide Express 48";
  }
  if (serviceName === "Palletforce Delivery - Next Day") {
    output = "Palletforce Delivery - Next Day";
  }
  if (
    serviceName === "Palletforce Delivery - 48 Hours" ||
    serviceName === "ukparcels_pfidw"
  ) {
    output = "Palletforce Delivery - 48 Hours";
  }
  if (serviceName === "ukparcels_pfsaturday" || serviceName === "Saturday Delivery") {
    output = "Parcelforce Saturday delivery";
  }
  if (serviceName === "ukparcels_pfsunday" || serviceName === "Sunday Delivery") {
    output = "Parcelforce Sunday delivery";
  }
  if (serviceName === "TNT UK Saturday Express") {
    output = "TNT UK Saturday Express";
  }
  if (serviceName === "TNT UK 12:00 Express") {
    output = "TNT UK 12:00 Express";
  }
  if (serviceName === "TNT UK Express Service") {
    output = "TNT UK Express Service";
  }
  // if (
  //   serviceName === "Hermes UK Collection" ||
  //   serviceName === "ukparcels_hermescollected" ||
  //   serviceName === "Hermes UK Collection Small Parcel"
  // ) {
  //   output = "Hermes UK Collection";
  // }
  // if (serviceName === "Hermes ParcelShop" || serviceName === "ukparcels_hermesdropoff") {
  //   output = "Drop off - Hermes ParcelShop";
  // }
  // if (serviceName === "Hermes UK Collection Medium Parcel") {
  //   output = "Hermes UK Collection Medium Parcel";
  // }
  // if (serviceName === "Hermes ParcelShop Small") {
  //   output = "Drop off - Hermes ParcelShop Small";
  // }
  // if (serviceName === "Hermes ParcelShop Medium") {
  //   output = "Drop off - Hermes ParcelShop Medium";
  // }
  // if (serviceName === "Hermes Light and Large") {
  //   output = "Hermes Light and Large";
  // }
  if (serviceName === "TNT UK 10:00 Express") {
    output = "TNT UK 10:00 Express";
  }
  if (serviceName === "TNT UK 09:00 Express") {
    output = "TNT UK 09:00 Express";
  }
  if (serviceName === "Yodel 24" || serviceName === "Yodel XpressPack 24") {
    output = "Yodel 24";
  }
  if (serviceName === "Yodel 48" || serviceName === "Yodel XpressPack 48") {
    output = "Yodel 48";
  }
  if (serviceName === "Collect+ Economy") {
    output = "Collect+ Economy";
  }
  if (serviceName === "UPS Express" || serviceName === "Next Day") {
    output = "UPS Express";
  }
  if (serviceName === "UPS Standard®" || serviceName === "StandardUPS") {
    output = "UPS Standard";
  }
  if (serviceName === "ExpressP4D") {
    output = "P4D Express";
  }
  if (
    serviceName === "Express Sameday Collect" ||
    serviceName === "Express SaverUPS" ||
    serviceName === "ukparcels_upsstandard_collected"
  ) {
    output = "UPS Express Sameday Collect";
  }
  if (
    serviceName === "UPS Access Point™" ||
    serviceName === "ukparcels_upsstandard_dropoff"
  ) {
    output = "Drop off - UPS Access Point™";
  }
  if (serviceName === "UPS Express® by 10.30am" || serviceName === "Express 10:30UPS") {
    output = "UPS Express® by 10.30am";
  }
  if (serviceName === "UPS Express Saver® by 12pm") {
    output = "UPS Express Saver® by 12pm";
  }
  if (serviceName === "InPost 48") {
    output = "Drop off - InPost 48";
  }
  if (
    serviceName === "DX24" ||
    serviceName === "ukbag_fast" ||
    serviceName === "ukparcels_nfnextday"
  ) {
    output = "DX 24H";
  }
  if (serviceName === "ukparcels_nfnextday") {
    output = "DX Freight";
  }
  if (serviceName === "DX48") {
    output = "DX 48H";
  }
  if (serviceName === "InPost 24") {
    output = "Drop off - InPost 24";
  }
  if (
    serviceName === "DPD Drop Off" ||
    serviceName === "Next Day Delivery Drop to ShopDPD"
  ) {
    output = "Drop off - DPD";
  }
  if (serviceName === "Collect+") {
    output = "Drop off - Collect+";
  }
  if (serviceName === "TNT UK Standard Service") {
    output = "TNT UK Standard Service";
  }
  if (serviceName === "Yodel by 12pm") {
    output = "Yodel by 12pm";
  }
  if (
    serviceName === "DHL UK" ||
    serviceName === "ukparcels_UKMailDomestic_NextDay" ||
    serviceName === "DHL Express"
  ) {
    output = "DHL UK NextDay";
  }
  if (
    serviceName === "ukparcels_UKMailDomestic_NextDay0900" ||
    serviceName === "DHL Express PRE 9AM"
  ) {
    output = "DHL UK NextDay by 9am";
  }
  if (serviceName === "ukparcels_UKMailDomestic_NextDay1030") {
    output = "DHL UK NextDay by 10am";
  }
  if (serviceName === "DHL Express PRE NOON") {
    output = "DHL UK NextDay by 12am";
  }
  if (serviceName === "ukparcels_UKMailDomestic_Saturday") {
    output = "DHL UK Saturday delivery";
  }
  if (serviceName === "Evri Collection") {
    output = "Evri Collection";
  }
  if (serviceName === "Evri ParcelShop") {
    output = "Evri ParcelShop";
  }
  if (serviceName === "InPost Lockers") {
    output = "InPost Lockers";
  }
  if (serviceName === "Yodel Direct") {
    output = "Yodel Direct";
  }
  if (serviceName === "ukparcels_yodel_72_dropoff") {
    output = "Yodel Economy Drop-off - Print Label In Store";
  }
  if (serviceName === "ukparcels_yodel_72_dropoff_label") {
    output = "Yodel Economy Drop-off - Print Label at Home";
  }
  if (serviceName === "Evri Light and Large") {
    output = "Evri Light and Large";
  }
  if (serviceName === "Evri ParcelShop Next Day") {
    output = "Evri ParcelShop Next Day";
  }
  if (
    serviceName === "DHL UK - Drop Off" ||
    serviceName === "ukparcels_dhlparceluk_nextday_dropoff"
  ) {
    output = "DHL UK - Drop Off";
  }
  if (serviceName === "Yodel Direct Economy") {
    output = "Yodel Direct Economy";
  }
  if (serviceName === "Tuffnells Next Day") {
    output = "Tuffnells Next Day";
  }
  if (serviceName === "Tuffnells Economy") {
    output = "Tuffnells Economy";
  }
  if (
    serviceName === "FedEx Next Day Drop Off" ||
    serviceName === "ukparcels_fedex_nextday"
  ) {
    output = "FedEx Next Day Drop Off - Print Label at Home ";
  }
  if (serviceName === "ukparcels_fedex_nextday_label") {
    output = "FedEx Next Day Drop Off - Print Label at Store ";
  }
  if (serviceName === "FedEx UK Drop Off") {
    output = "FedEx UK Drop Off";
  }
  if (serviceName === "DPD Collection" || serviceName === "ukparcels_dpdcollected24") {
    output = "DPD Collection";
  }
  if (serviceName === "") {
    output = "";
  }
  if (serviceName === "") {
    output = "";
  }
  if (serviceName === "") {
    output = "";
  }
  if (serviceName === "") {
    output = "";
  }
  if (output === "") {
    console.log("new serviceName: ", serviceName, courier);
  }
  return output;
};
export const courierNameP4D = (courierName: string) => {
  let output = "";

  if (
    courierName === "Parcelforce 24" ||
    courierName === "Parcelforce by 9am" ||
    courierName === "Parcelforce by 10am" ||
    courierName === "Parcelforce 48" ||
    courierName === "Parcelforce AM" ||
    courierName === "Parcelforce Large" ||
    courierName === "Sunday Delivery" ||
    courierName === "Saturday Delivery" ||
    courierName === "Parcelforce by 12pm"
  ) {
    output = "Parcelforce";
  }
  if (courierName === "Express Sameday Collect" || courierName === "UPS Express") {
    output = "UPS";
  }
  if (
    courierName === "DHL Express" ||
    courierName === "DHL Express PRE NOON" ||
    courierName === "DHL Express PRE 9AM" ||
    courierName === "DHL Express"
  ) {
    output = "DHL";
  }
  if (output === "") {
    console.log("new courierNameP4D: ", courierName);
  }

  return output;
};
