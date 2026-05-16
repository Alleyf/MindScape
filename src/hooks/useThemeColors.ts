// Theme colors customization hook

import { useState, useEffect, useCallback } from 'react';

export interface ThemeColors {
  accent: string;
  glow: string;
  purple: string;
  blue: string;
}

const DEFAULT_DARK_COLORS: ThemeColors = {
  accent: '#d97757',
  glow: '#c96442',
  purple: '#8f4f32',
  blue: '#6f7669',
};

const DEFAULT_LIGHT_COLORS: ThemeColors = {
  accent: '#d97757',
  glow: '#c96442',
  purple: '#8f4f32',
  blue: '#6f7669',
};

const STORAGE_KEY = 'mindscape-theme-colors';
const STORAGE_KEY_LIGHT = 'mindscape-theme-colors-light';

function loadColorsFromStorage(isLight: boolean): ThemeColors {
  try {
    const stored = localStorage.getItem(isLight ? STORAGE_KEY_LIGHT : STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch {
    // ignore
  }
  return isLight ? DEFAULT_LIGHT_COLORS : DEFAULT_DARK_COLORS;
}

function saveColorsToStorage(colors: ThemeColors, isLight: boolean) {
  try {
    localStorage.setItem(
      isLight ? STORAGE_KEY_LIGHT : STORAGE_KEY,
      JSON.stringify(colors)
    );
  } catch {
    // ignore
  }
}

export function useThemeColors() {
  const [darkColors, setDarkColors] = useState<ThemeColors>(() => loadColorsFromStorage(false));
  const [lightColors, setLightColors] = useState<ThemeColors>(() => loadColorsFromStorage(true));
  const [isLight, setIsLight] = useState(() => document.documentElement.classList.contains('light-theme'));

  const toggleTheme = useCallback(() => {
    setIsLight(prev => {
      const newValue = !prev;
      if (newValue) {
        document.documentElement.classList.add('light-theme');
        localStorage.setItem('theme', 'light');
      } else {
        document.documentElement.classList.remove('light-theme');
        localStorage.setItem('theme', 'dark');
      }
      return newValue;
    });
  }, []);

  // Apply colors to CSS variables
  useEffect(() => {
    const colors = isLight ? lightColors : darkColors;
    const root = document.documentElement;

    root.style.setProperty('--nebula-accent', colors.accent);
    root.style.setProperty('--nebula-glow', colors.glow);
    root.style.setProperty('--nebula-purple', colors.purple);
    root.style.setProperty('--nebula-blue', colors.blue);

    // Update derived colors
    root.style.setProperty('--nebula-glow', colors.glow);

  }, [darkColors, lightColors, isLight]);

  const updateDarkColors = useCallback((colors: Partial<ThemeColors>) => {
    setDarkColors(prev => {
      const updated = { ...prev, ...colors };
      saveColorsToStorage(updated, false);
      return updated;
    });
  }, []);

  const updateLightColors = useCallback((colors: Partial<ThemeColors>) => {
    setLightColors(prev => {
      const updated = { ...prev, ...colors };
      saveColorsToStorage(updated, true);
      return updated;
    });
  }, []);

  const updateColors = useCallback((colors: Partial<ThemeColors>) => {
    if (isLight) {
      updateLightColors(colors);
    } else {
      updateDarkColors(colors);
    }
  }, [isLight, updateDarkColors, updateLightColors]);

  const resetToDefault = useCallback(() => {
    if (isLight) {
      setLightColors(DEFAULT_LIGHT_COLORS);
      saveColorsToStorage(DEFAULT_LIGHT_COLORS, true);
    } else {
      setDarkColors(DEFAULT_DARK_COLORS);
      saveColorsToStorage(DEFAULT_DARK_COLORS, false);
    }
  }, [isLight]);

  const currentColors = isLight ? lightColors : darkColors;

  return {
    darkColors,
    lightColors,
    currentColors,
    isLight,
    toggleTheme,
    updateDarkColors,
    updateLightColors,
    updateColors,
    resetToDefault,
  };
}
