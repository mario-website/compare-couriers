import {Variables} from "../types";

export const VARIABLES: Variables = {
  PARCEL2GO: "PARCEL 2GO",
  PARCEL2GO_LOGO_SRC: "p2g-logo.svg",
  PARCEL_MONKEY: "PARCEL_MONKEY",
  PARCEL_MONKEY_LOGO_SRC: "parcelMonkey-logo.png",
  P4D: "P4D",
  P4D_LOGO_SRC: "p4d-logo.svg",
  SLOW: "SLOW",
  MEDIUM: "MEDIUM",
  FAST: "FAST",
  SMALL: "SMALL",
  LARGE: "LARGE",
  ALL: "ALL",
  VALUE: "VALUE",
  WEIGHT: "WEIGHT",
  LENGTH: "LENGTH",
  WIDTH: "WIDTH",
  HEIGHT: "HEIGHT",
};

const {LARGE, MEDIUM, SMALL} = VARIABLES;

export const getScreenSize = (width: number) => {
  //IMPORTANT!!!!!!!
  //------------------------------------------------------------------------------------------------
  //when changing MD or LR values you need also update file src/scss/globals/_breakpoints.scss
  //in values $MD and $LR
  // const $FR = 320;
  // const SM = 530;
  const MD = 768;
  const LR = 1024;
  //------------------------------------------------------------------------------------------------
  let screenSize: string = "";
  if (width < MD) screenSize = SMALL;
  if (width >= MD && width <= LR) screenSize = MEDIUM;
  if (width > LR) screenSize = LARGE;
  return screenSize;
};
