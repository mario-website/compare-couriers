const express = require("express");
const app = express();
app.use(express.json());
const fetch = (...args) =>
  import("node-fetch").then(({default: fetch}) => fetch(...args));
require("dotenv").config();
app.use(express.static("src/assets/logo"));

const port = process.env.PORT || process.env.REACT_APP_LOCAL_SERVER_PORT;
const couriersNamesArr = [
  {apiUrl: "/api/parcelmonkey/", companyName: "PARCEL_MONKEY", method: app.post},
  {apiUrl: "/api/p2g/", companyName: "PARCEL2GO", method: app.post},
];

if (process.env.NODE_ENV === "production") {
  app.use(express.static("build"));
}

couriersNamesArr.forEach((courier) => {
  app.post(courier.apiUrl, async (req, res) => {
    try {
      const response = await fetch(req.body.url, req.body);
      const data = await response.json();
      res.json(data);
    } catch (error) {
      console.error(error);
    }
  });
});

app.listen(port, () => console.log(`Listening on port ${port}`));

//below comments will use in the future to scrapp from other couriers websites

// app.get("/", (req, res) => {
//   res.render("index");
// });
// app.get("/api/p4d/", (req, res) => {
// superagent
//   .get("https://app.p4d.co.uk/quotes/GB:RM191ZY/PL:51-315/7,12,34,56")
//   .query()
//   .end(function (err, response) {
//     if (err) {
//       res.json({
//         confirmation: "fail",
//         message: err,
//       });
//       return;
//     }
//     let aa;
//     aa = cheerio.load(response.text);
//     // console.log(`aa:`, aa);
//     let a = [];
//     aa("div").each(function (i, el) {
//       // console.log(`i:`, el.text());
//       // a.push(el.text());
//       // const service_nameP4D = $(this).text();
//     });
//     //.split("\n") = I split to array where each value are splited by enter key
//     const service_nameArray = service_nameP4D.split("\n");
//     service_nameArray.forEach((name, i) => {
//       //.trim() remove white spaces
//       service_nameArray[i] = name.trim();
//     });
//     const service_nameP4DArray = service_nameArray[1];
//     const priceP4D = service_nameArray[3];
//     //remove from string priceP4D all characters but not numbers
//     const price = priceP4D.replace(/[^\d.-]/g, "");
//     const courier_name = normalizerNames.courierNameP4D(
//       service_nameP4DArray
//     );
//     const service_name = normalizerNames.serviceName(
//       service_nameP4DArray,
//       "p4d.co.uk"
//     );
//     outputArray[i] = Object.assign({}, outputArray[i], {
//       company_name: "p4d.co.uk",
//       price: price,
//       service_name: service_name,
//       courier_name: courier_name
//     });
//   });
//   $(
//     "#newquote-list li form  .newquote-topbox .newquote-delivery-time b"
//   ).each(function(i, el) {
//     const deliveryTimeP4D = $(this).text();
//     const deliveryTime = normalizerNames.deliveryTime(
//       deliveryTimeP4D,
//       "p4d.co.uk"
//     );
//     outputArray[i] = Object.assign({}, outputArray[i], {
//       deliveryTime
//     });
//   });
// res.json(a);
// });
// });
