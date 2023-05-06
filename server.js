const express = require("express");
const app = express();
app.use(express.json());
const playwright = require("playwright");
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

app.post("/api/parcelbroker/", async (req, res) => {
  const {WEIGHT, LENGTH, WIDTH, HEIGHT} = JSON.parse(req.body.body);

  const browser = await playwright.chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();
  toGetConsoleLogInNode(page);
  // <---------------->
  // BEGGINING OF PART ONE: 1. GO TO WEBSITE, 2. WAITING TO BE LOAD THAT WEBSITE, 3. FILLING WITH VALUES, 4. GET A GOUTE WITH VALUES

  // 1. GO TO WEBSITE
  await page.goto(req.body.url);

  // 2. WAITING TO BE LOAD THAT WEBSITE
  await page.waitForSelector("input[name='length_0']");
  const buttons = await page.$$("#quote_form button");
  let buttonToClick = null;

  for (let button of buttons) {
    let buttonText = await page.evaluate((element) => element.textContent, button);
    if (buttonText && buttonText.trim() === "Compare Prices") {
      buttonToClick = button;
      break;
    }
  }

  try {
    // 3. FILLING WITH VALUES
    await page.fill("input[name='length_0']", LENGTH.toString());
    await page.fill("input[name='width_0']", WIDTH.toString());
    await page.fill("input[name='height_0']", HEIGHT.toString());
    await page.fill("input[name='weight_0']", WEIGHT.toString());
    // 4. GET A GOUTE WITH VALUES
    await buttonToClick?.click();
    // END OF PART ONE
    // <---------------->

    // <---------------->
    // BEGGINING OF PART TWO
    await page.waitForFunction(() => {
      const spans = document.querySelectorAll("span");
      for (const span of spans) {
        if (span.textContent?.includes("Services")) {
          return true;
        }
      }
      return false;
    });

    const allResults = await page.$$eval(
      ".border-2.m-4.flex.flex-wrap.bg-gray-100.rounded-md",
      (elements) =>
        elements
          .map((element) => {
            // <---------------->
            // example:
            // const fullServiceName = 'Parcelforce: Express by 09:00 am Drop Off (where available)'
            const fullServiceName = element.querySelector("h3")?.textContent;

            // example after formatting:
            // const serviceName = 'Express by 09:00 am Drop Off (where available)'
            const serviceName = fullServiceName?.split(":")[1]?.trim();
            // const courierName = 'Parcelforce'
            const courierName = fullServiceName?.split(":")[0]?.trim();
            // <---------------->

            // <---------------->
            // example:
            // const deliveryTime = 'Typical Transit Time  1 business day By 9AM\n' +
            // '                    \n' +
            // '                                More Info...\n' +
            // '                            ',

            const deliveryTime = element
              .querySelector("div > div.text-center")
              ?.textContent?.replace(
                /Typical Transit Time\s+|\n\s+More Info...\n\s+/g,
                ""
              );

            // example after formatting:
            // const deliveryTime = '1 business day By 9AM'
            // <---------------->

            // <---------------->
            // example
            // const priceText = '£70.49 inc VAT'
            const priceText = element.querySelector(
              ".text-center.text-xs.pb-2"
            )?.textContent;
            const price = priceText ? priceText.replace(/[^0-9.]/g, "") : "";
            // example after formatting:
            // const price = '70.49'
            // <---------------->

            return {
              fullServiceName,
              courierName,
              serviceName,
              deliveryTime,
              price,
            };
          })
          .filter((e) => e.serviceName !== undefined && e.deliveryTime !== "")
    );
    // END OF PART TWO
    // <---------------->
    res.json(allResults);
  } catch (error) {
    console.error(error);
    res.status(500).json({error: "Wystąpił błąd podczas przetwarzania żądania"});
  } finally {
    await browser.close();
  }

  await browser.close();
});

app.post("/api/p4d/", async (req, res) => {
  const browser = await playwright.chromium.launch();
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
  } finally {
    await browser.close();
  }
  // try {
  //   const allResults = await page.$$eval(".sc-AxiKw", (elements) => {
  //     return elements.map((element) => {
  //       const courierName = element.querySelector("img")?.getAttribute("src");
  //       const serviceName = element.querySelector(".sc-fzoLsD")?.textContent;
  //       const deliveryTime = element.querySelector(".sc-fzonjX")?.textContent;
  //       const price = element.querySelector(".sc-fzoPby")?.textContent;
  //       return {
  //         courierName,
  //         serviceName,
  //         deliveryTime,
  //         price,
  //       };
  //     });
  //   });
  //   res.json(allResults);
  // } catch (error) {
  //   console.error(error);
  // }
  // await browser.close();

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
  // await browser.close();
  //----------------------
});

/**
 * @param {playwright.Page} page
 */
function toGetConsoleLogInNode(page) {
  page.on("console", (msg) => {
    for (let i = 0; i < msg.args().length; ++i) console.log(`${i}: ${msg.args()[i]}`);
  });
}

// const nestedDivWithThreeElements = Array.from(
//   element.querySelectorAll(".text-center")
// ).find((nestedDiv) => {
//   const pCount = nestedDiv.querySelectorAll(":scope > p").length;
//   const ulCount = nestedDiv.querySelectorAll(":scope > ul").length;

//   return pCount === 1 && ulCount === 1;
// });

// const rawDeliveryTime = nestedDivWithThreeElements
//   ? nestedDivWithThreeElements.innerText.replace(
//       /Typical Transit Time\s+|\n\s+More Info...\n\s+/g,
//       ""
//     )
//   : "";

// const deliveryTime = rawDeliveryTime || "";
