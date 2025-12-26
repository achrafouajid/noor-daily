import { useState, useEffect } from 'react';
import { getItem, setItem } from '../storage';

const IS_FIRST_TIME = 'IS_FIRST_TIME';

export const useIsFirstTime = () => {
  const [isFirstTime, setIsFirstTimeState] = useState<boolean>(() => {
    const val = getItem<boolean>(IS_FIRST_TIME);
    return val ?? true;
  });

  const setIsFirstTime = (value: boolean) => {
    setIsFirstTimeState(value);
    setItem(IS_FIRST_TIME, value);
  };

  return [isFirstTime, setIsFirstTime] as const;
};
