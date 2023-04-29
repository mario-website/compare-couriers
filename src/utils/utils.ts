import countryCodes from "./countryCodes";

interface CountryCode {
  "ISO2 CODE": string;
  "ISO3 CODE": string;
}

export const dynamicSort = (property: string) => {
  if (property === "price") {
    return (a: Record<string, any>, b: Record<string, any>) => a[property] - b[property];
  }
  if (property === "-price") {
    property = property.slice(1);
    return (a: Record<string, any>, b: Record<string, any>) => b[property] - a[property];
  }
  let sortOrder = 1;
  if (property[0] === "-") {
    sortOrder = -1;
    property = property.slice(1);
  }
  return (a: Record<string, any>, b: Record<string, any>) => {
    const result = a[property] < b[property] ? -1 : a[property] > b[property] ? 1 : 0;
    return result * sortOrder;
  };
};

export const isNumeric = (num: string | number): boolean => {
  const value = typeof num === "string" ? parseFloat(num) : num;
  return !isNaN(value);
};

export const convertIso2ToIso3 = (iso2: string): string | undefined => {
  if (iso2) {
    const foundCountryCode = countryCodes.find(
      (e: CountryCode) => e["ISO2 CODE"] === iso2
    );
    if (foundCountryCode) return foundCountryCode["ISO3 CODE"];
  }
};

export const generateUUID = (): string => {
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
    return (c === "x" ? r : (r & 0x7) | 0x8).toString(16);
  });
};
