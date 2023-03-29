const express = require("express");
const app = express();
app.use(express.json());
const puppeteer = require("puppeteer");
const {chromium} = require("playwright");
const fetch = (...args) =>
  import("node-fetch").then(({default: fetch}) => fetch(...args));
require("dotenv").config();
app.use(express.static("src/assets/logo"));
const port = process.env.PORT || process.env.REACT_APP_LOCAL_SERVER_PORT;
app.listen(port, () => console.log(`Listening on port ${port}`));

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

app.post("/api/p4d/", async (req, res) => {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();
  await page.goto(req.body.url);
  await page.waitForSelector(".sc-fzoCCn");

  try {
    const allResults = await page.$$eval(".sc-AxiKw", (elements) => {
      return elements.map((element) => {
        const courierName = element.querySelector("img")?.getAttribute("src");
        const serviceName = element.querySelector(".sc-fzoLsD")?.textContent;
        const deliveryTime = element.querySelector(".sc-fzonjX")?.textContent;
        const price = element.querySelector(".sc-fzoPby")?.textContent;
        return {
          courierName,
          serviceName,
          deliveryTime,
          price,
        };
      });
    });
    res.json(allResults);
  } catch (error) {
    console.error(error);
  }

  //BELOW IS ANOTHER WORKING SOLUTION TO SCRAP
  //----------------------
  // const html = await page.content();
  // const $ = cheerio.load(html);

  // const allResults = $(".sc-AxiKw")
  //   .map((i, el) => {
  //     const courierName = $(el).find("img").attr("src").reverse();
  //     const serviceName = $(el).find(".sc-fzoLsD").text();
  //     const deliveryTime = $(el).find(".sc-fzonjX").text();
  //     const price = $(el).find(".sc-fzoPby").text();
  //     return {courierName, serviceName, price, deliveryTime};
  //   })
  //   .get();

  // res.json(allResults);
  //----------------------

  await browser.close();
});
