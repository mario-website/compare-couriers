const {VARIABLES} = require("./postActionTypes.js");
const {SLOW, MEDIUM, FAST} = VARIABLES;
module.exports = {
  // This is the function which will be called in the main file, which is server.js
  // The parameters 'name' and 'surname' will be provided inside the function
  // when the function is called in the main file.
  // Example: concatenameNames('John,'Doe');
  courierNameP4D: (courierName) => {
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
      // console.log("new courierNameP4D: ", courierName);
    }

    return output;
  },
  courierName: (courierName, courier) => {
    let output = "";

    if (courierName === "MyHermes" || courierName === "Hermes") {
      output = "Hermes";
    }
    if (
      courierName === "Parcelforce 24" ||
      courierName === "Parcelforce by 9am" ||
      courierName === "Parcelforce by 10am" ||
      courierName === "Parcelforce 48" ||
      courierName === "Parcelforce AM" ||
      courierName === "Parcelforce Large" ||
      courierName === "Sunday Delivery" ||
      courierName === "Saturday Delivery" ||
      courierName === "Parcelforce by 12pm" ||
      courierName === "Parcelforce"
    ) {
      output = "Parcelforce";
    }
    if (courierName === "Yodel" || courierName === "Yodel Direct") {
      output = "Yodel";
    }
    if (
      courierName === "UPS" ||
      courierName === "UPS Access Point" ||
      courierName === "Express Sameday Collect" ||
      courierName === "UPS Express"
    ) {
      output = "UPS";
    }
    if (courierName === "TNT") {
      output = "TNT";
    }
    if (courierName === "Collect+") {
      output = "Collect+";
    }
    if (courierName === "InPost") {
      output = "InPost";
    }
    if (courierName === "DX") {
      output = "DX";
    }
    if (courierName === "DPD" || courierName === "DPD Collection") {
      output = "DPD";
    }
    if (courierName === "PalletForce") {
      output = "PalletForce";
    }
    if (
      courierName === "DHL Express" ||
      courierName === "DHL Express PRE NOON" ||
      courierName === "DHL Express PRE 9AM" ||
      courierName === "DHL" ||
      courierName === "DHL Parcel UK" ||
      courierName === "DHL Parcel"
      // ||
      // courierName === "DHL UK - Drop Off"
    ) {
      output = "DHL";
    }
    if (
      courierName === "Evri Collection" ||
      courierName === "Evri Drop-off" ||
      courierName === "Evri ParcelShop Next Day"
    ) {
      output = "Evri";
    }
    if (courierName === "Tuffnells") {
      output = "Tuffnells";
    }
    if (courierName === "FedEx Express") {
      output = "FedEx";
    }
    // if (courierName === 'InPost Lockers') {
    //   output = 'InPost'
    // }
    if (output === "") {
      // console.log("new courierName: ", courierName, courier);
    }

    return output;
  },

  deliveryTime: (deliveryTime, courier) => {
    let output = "";

    if (
      deliveryTime === "Fast" ||
      deliveryTime === "Saturday Delivery" ||
      deliveryTime === "Sunday Delivery" ||
      deliveryTime === "DHL Parcel UK" ||
      deliveryTime === "Parcelforce 24" ||
      deliveryTime === "Parcelforce by 9am" ||
      deliveryTime === "Parcelforce by 10am" ||
      deliveryTime === "Parcelforce by 12pm" ||
      deliveryTime === "DHL Parcel Next Day" ||
      deliveryTime === "Next Day before 9am" ||
      deliveryTime === "Next Day before 10.30am" ||
      deliveryTime === "DHL Parcel UK Next Day" ||
      deliveryTime === "Next Day Before 12pm" ||
      deliveryTime === "Next Day Before 10am" ||
      deliveryTime === "DPD Pickup" ||
      deliveryTime === "Next Day Before 9am" ||
      deliveryTime === "Sunday" ||
      deliveryTime === "Saturday" ||
      deliveryTime === "Next working day" ||
      deliveryTime === "DHL Parcel UK Next Day Drop Off" ||
      deliveryTime === "DPD Next Day Collected" ||
      deliveryTime === "DX Next Day"
    ) {
      output = FAST;
    }
    if (
      deliveryTime === "Parcelforce 48" ||
      deliveryTime === "1-2 days drop off service" ||
      deliveryTime === "Medium" ||
      deliveryTime === "Parcelforce Large" ||
      deliveryTime === "2 working days"
    ) {
      output = MEDIUM;
    }
    if (deliveryTime === "Slow") {
      output = SLOW;
    }
    if (output === "") {
      // console.log("new deliveryTime: ", deliveryTime, courier);
    }
    return output;
  },
  serviceName: (serviceName, courier) => {
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
    if (serviceName === "Palletforce Delivery - 48 Hours") {
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
    if (
      serviceName === "Hermes UK Collection" ||
      serviceName === "Hermes UK Collection Small Parcel"
    ) {
      output = "Hermes UK Collection";
    }
    if (serviceName === "Hermes ParcelShop") {
      output = "Drop off - Hermes ParcelShop";
    }
    if (serviceName === "Hermes UK Collection Medium Parcel") {
      output = "Hermes UK Collection Medium Parcel";
    }
    if (serviceName === "Hermes ParcelShop Small") {
      output = "Drop off - Hermes ParcelShop Small";
    }
    if (serviceName === "Hermes ParcelShop Medium") {
      output = "Drop off - Hermes ParcelShop Medium";
    }
    if (serviceName === "Hermes Light and Large") {
      output = "Hermes Light and Large";
    }
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
    if (
      serviceName === "UPS Standard®" ||
      serviceName === "UPS Express" ||
      serviceName === "Next Day"
    ) {
      output = "UPS Standard";
    }
    if (serviceName === "Express Sameday Collect") {
      output = "UPS Express Sameday Collect";
    }
    if (serviceName === "UPS Access Point™") {
      output = "Drop off - UPS Access Point™";
    }
    if (serviceName === "InPost 48") {
      output = "Drop off - InPost 48";
    }
    if (serviceName === "DX24" || serviceName === "ukbag_fast") {
      output = "DX 24H";
    }
    if (serviceName === "DX48") {
      output = "DX 48H";
    }
    if (serviceName === "InPost 24") {
      output = "Drop off - InPost 24";
    }
    if (serviceName === "DPD Drop Off") {
      output = "Drop off - DPD";
    }
    if (serviceName === "UPS Express® by 10.30am") {
      output = "UPS Express® by 10.30am";
    }
    if (serviceName === "UPS Express Saver® by 12pm") {
      output = "UPS Express Saver® by 12pm";
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
    if (serviceName === "Evri Light and Large") {
      output = "Evri Light and Large";
    }
    if (serviceName === "Evri ParcelShop Next Day") {
      output = "Evri ParcelShop Next Day";
    }
    if (serviceName === "DHL UK - Drop Off") {
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
    if (serviceName === "FedEx Next Day Drop Off") {
      output = "FedEx Next Day Drop Off";
    }
    if (serviceName === "FedEx UK Drop Off") {
      output = "FedEx UK Drop Off";
    }
    if (serviceName === "DPD Collection") {
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
      // console.log("new serviceName: ", serviceName, courier);
    }
    return output;
  },
};
