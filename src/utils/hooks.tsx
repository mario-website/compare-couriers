import {useCallback, useEffect, useLayoutEffect, useRef, useState} from "react";
import {getScreenSize} from "./common";

export interface ReturnUseBoolean {
  value: boolean;
  setValue: React.Dispatch<React.SetStateAction<boolean>>;
  toggle: () => void;
  setTrue: () => void;
  setFalse: () => void;
}

export const useBoolean = (initial: boolean) => {
  const [value, setValue] = useState<boolean>(initial);
  const returnUseBoolean: ReturnUseBoolean = {
    value,
    setValue,
    toggle: useCallback(() => setValue((v) => !v), []),
    setTrue: useCallback(() => setValue(true), []),
    setFalse: useCallback(() => setValue(false), []),
  };
  return returnUseBoolean;
};

export const useScreenSize = () => {
  const [screenSize, setScreenSize] = useState<string>("");
  const [prevScreenSize, setPrevScreenSize] = useState<string>(screenSize);
  const [width] = useWindowSize();

  useEffect(() => {
    //3.0
    //get value of previous screenSize and set setPrevScreenSize.
    setScreenSize((prev) => {
      setPrevScreenSize(prev);
      //...and set current screenSize
      return getScreenSize(width);
    });
  }, [width]);

  let returnUseScreenSize: [string, string];

  returnUseScreenSize = [screenSize, prevScreenSize];

  return returnUseScreenSize;
};

const useWindowSize = () => {
  const [size, setSize] = useState<[number, number]>([0, 0]);
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

export const usePrevious = (value: any) => {
  const ref = useRef<React.MutableRefObject<undefined>>();
  useEffect(() => {
    ref.current = value;
  }, [value]);
  return ref.current;
};
