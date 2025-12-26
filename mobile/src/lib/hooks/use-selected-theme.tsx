import { colorScheme, useColorScheme } from 'nativewind';
import React, { useState, useCallback } from 'react';
import { getItem, setItem } from '../storage';

const SELECTED_THEME = 'SELECTED_THEME';
export type ColorSchemeType = 'light' | 'dark' | 'system';

export const useSelectedTheme = () => {
  const { colorScheme: _color, setColorScheme } = useColorScheme();
  const [theme, _setTheme] = useState<ColorSchemeType | undefined>(() => {
    const val = getItem<ColorSchemeType>(SELECTED_THEME);
    return val ?? undefined;
  });

  const setSelectedTheme = useCallback(
    (t: ColorSchemeType) => {
      setColorScheme(t);
      _setTheme(t);
      setItem(SELECTED_THEME, t);
    },
    [setColorScheme]
  );

  const selectedTheme = (theme ?? 'system') as ColorSchemeType;
  return { selectedTheme, setSelectedTheme } as const;
};

export const loadSelectedTheme = () => {
  const theme = getItem<string>(SELECTED_THEME);
  if (theme !== null) {
    colorScheme.set(theme as ColorSchemeType);
  }
};
