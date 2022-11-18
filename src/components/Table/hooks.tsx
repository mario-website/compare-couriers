import {useCallback, useState} from "react";

export const useBoolean = (initial: boolean) => {
  const [value, setValue] = useState<boolean>(initial);
  interface ReturnUseBoolean {
    value: boolean;
    setValue: React.Dispatch<React.SetStateAction<boolean>>;
    toggle: () => void;
    setTrue: () => void;
    setFalse: () => void;
  }
  const returnUseBoolean: ReturnUseBoolean = {
    value,
    setValue,
    toggle: useCallback(() => setValue((v) => !v), []),
    setTrue: useCallback(() => setValue(true), []),
    setFalse: useCallback(() => setValue(false), []),
  };
  return returnUseBoolean;
};
