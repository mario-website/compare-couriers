const couriers = [
  // {apiUrl: "/api/p4d/", courierName: "p4d"},
  {apiUrl: "/api/p2g/", courierName: "parcel2go"},
];

module.exports = {
  couriers,
  getApiUrl: (courierName) =>
    couriers.filter((name) => name.courierName === courierName)[0].apiUrl,
};
