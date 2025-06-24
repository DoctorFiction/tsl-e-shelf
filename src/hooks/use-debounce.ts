"use client";
import { useEffect, useState, useRef } from "react";

const useDebounce = <T>(value: T, delay = 3000) => {
  const [returnValue, setValue] = useState<T>(value);
  const timer = useRef<NodeJS.Timeout | undefined>(undefined);

  useEffect(() => {
    if (timer.current) {
      clearTimeout(timer.current);
    }

    timer.current = setTimeout(() => {
      setValue(value);
    }, delay);

    return () => {
      if (timer.current) {
        clearTimeout(timer.current);
      }
    };
  }, [delay, value]);

  return returnValue;
};

export default useDebounce;
