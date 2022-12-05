import countryCodes from "./countryCodes";

export const dynamicSort = (property: string) => {
  interface AB {
    [x: string]: number;
  }

  if (property === "price") {
    return (a: AB, b: AB) => a[property] - b[property];
  }
  if (property === "-price") {
    property = property.slice(1);
    return (a: AB, b: AB) => b[property] - a[property];
  }
  let sortOrder = 1;
  if (property[0] === "-") {
    sortOrder = -1;
    property = property.slice(1);
  }
  return (a: AB, b: AB) => {
    /* next line works with strings and numbers,
     * and you may want to customize it to your needs
     */
    const result = a[property] < b[property] ? -1 : a[property] > b[property] ? 1 : 0;
    return result * sortOrder;
  };
};

//znalazłem taki validator aby sprawdzić wszystkie mozliwości czy ciąg znaków jest liczbą -
//(tak mówią na stacku przynajmniej :) ):
//https://stackoverflow.com/questions/175739/how-can-i-check-if-a-string-is-a-valid-number
export const isNumeric = (num: any) =>
  (typeof num === "number" || (typeof num === "string" && num.trim() !== "")) &&
  !isNaN(num as number);

export const convertIso2ToIso3 = (iso2: string) => {
  if (iso2) {
    const foundCountryCoude = countryCodes.find((e) => e["ISO2 CODE"] === iso2);
    if (foundCountryCoude) return foundCountryCoude["ISO3 CODE"];
  }
};

export const generateUUID = () => {
  let d = new Date().getTime(),
    d2 = (performance && performance.now && performance.now() * 1000) || 0;
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    let r = Math.random() * 16;
    if (d > 0) {
      r = (d + r) % 16 | 0;
      d = Math.floor(d / 16);
    } else {
      r = (d2 + r) % 16 | 0;
      d2 = Math.floor(d2 / 16);
    }
    // eslint-disable-next-line eqeqeq
    return (c == "x" ? r : (r & 0x7) | 0x8).toString(16);
  });
};
