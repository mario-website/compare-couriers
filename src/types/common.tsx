export interface CourierData {
  names: CouriersNames;
  getToken?: {
    url: string;
    options: {
      method: string;
      headers: {
        Accept: string;
        "User-Agent": string;
        "Content-Type": string;
      };
      body: string;
    };
  };
  getData: {
    url: string;
    options: {
      method: string;
      headers: {};
      body: string;
    };
  };
}

export interface DefaultValues {
  VALUE: number;
  WEIGHT: number;
  LENGTH: number;
  WIDTH: number;
  HEIGHT: number;
  IS_ASCENDING: boolean;
  SORTED_BY: string;
  COUNTRY_FROM: string;
  COUNTRY_TO: string;
  POSTCODE_FROM: string;
  POSTCODE_TO: string;
}

export interface TimeSpeedData {
  id: string;
  min: number;
  max: number;
  deliveryTime: string;
  serviceData: SingleFormatedItem[];
  serviceName: string;
}

export interface TempData {
  id: string;
  min: number;
  max: number;
  deliveryTime: string;
  serviceData: SingleFormatedItem[];
  serviceName: string;
  courierName: string;
}

export interface ReturnNewData {
  id: string;
  deliveryTime: string;
  minPrice: number;
  maxPrice: number;
  timeSpeedData: TempData[];
}

export interface SingleFormatedItem {
  id?: string;
  companyName: string;
  courierName: string;
  deliveryTime: string;
  logoSrc: string;
  price: string;
  serviceName: string;
  url: string;
}

export interface DefaultData {
  rowsData: any[];
  titles: string[];
  options: {
    sortedBy: string;
    isAscending: boolean;
    deliveryTimeBtn: string;
  };
  data: ReturnNewData[];
  mergedAllData: any[];
}

export interface CouriersNames {
  apiUrl: string;
  companyName: string;
}

export interface Variables {
  PARCEL2GO: string;
  PARCEL2GO_LOGO_SRC: string;
  PARCEL_MONKEY: string;
  PARCEL_MONKEY_LOGO_SRC: string;
  P4D: string;
  P4D_LOGO_SRC: string;
  SLOW: string;
  MEDIUM: string;
  FAST: string;
  SMALL: string;
  LARGE: string;
  ALL: string;
  VALUE: string;
  WEIGHT: string;
  LENGTH: string;
  WIDTH: string;
  HEIGHT: string;
}

export interface Dimensions {
  name: string;
  labelName: string;
  placeholder: string;
  units: string;
}
