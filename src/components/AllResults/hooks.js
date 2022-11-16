import {useEffect, useState, useLayoutEffect} from "react";
import {VARIABLES} from "../../utils/variables";
const {FAST, MEDIUM, SLOW, SMALL, LARGE, ALL} = VARIABLES;

export const useScreenSize = () => {
  const [screenSize, setScreenSize] = useState("");
  const [prevScreenSize, setPrevScreenSize] = useState(screenSize);
  const [width, height] = useWindowSize();

  useEffect(() => {
    //3.0
    setScreenSize((prev) => {
      setPrevScreenSize(prev);
      return getScreenSize(width);
    });
  }, [width]);
  return [screenSize, prevScreenSize];
};

const useWindowSize = () => {
  const [size, setSize] = useState([0, 0]);
  useLayoutEffect(() => {
    //to not setSize for every window change, added small delay 100ms for
    //reading and set curent window.innerWidth and window.innerHeight
    //founded delay at https://stackoverflow.com/a/63010184
    //3.1
    const withDelayUpdate = () => {
      setSize([window.innerWidth, window.innerHeight]);
    };
    withDelayUpdate();
    window.addEventListener("resize", withDelayUpdate);
    return () => window.removeEventListener("resize", withDelayUpdate);
  }, []);
  return size;
};
//3.0
const getScreenSize = (width) => {
  if (width < 650) return SMALL;
  if (width >= 650 && width < 850) return MEDIUM;
  if (width >= 850) return LARGE;
};
