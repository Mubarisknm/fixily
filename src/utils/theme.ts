import { ThemeMode } from '../types';

export interface ThemeConfig {
  id: ThemeMode;
  name: string;
  isDark: boolean;
}

export const THEMES: Record<ThemeMode, ThemeConfig> = {
  light: {
    id: 'light',
    name: 'Day Light Mode',
    isDark: false
  },
  dark: {
    id: 'dark',
    name: 'Night Dark Mode',
    isDark: true
  }
};
