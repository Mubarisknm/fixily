import { ThemeMode } from '../types';

export interface ThemeConfig {
  id: ThemeMode;
  name: string;
  isDark: boolean;
  primary: string;
  dark: string;
  background: string;
  accent: string;
}

export const THEME_COLORS = {
  primary: '#2563EB',      // Electric/modern blue
  dark: '#0F172A',         // Navy/near-black
  background: '#F8FAFC',   // Off-white
  accent: '#22C55E',       // Green for success/availability
  surfaceLight: '#FFFFFF',
  surfaceDark: '#1E293B',
  borderLight: '#E2E8F0',
  borderDark: '#334155'
} as const;

export const THEMES: Record<ThemeMode, ThemeConfig> = {
  light: {
    id: 'light',
    name: 'Day Light Mode',
    isDark: false,
    primary: THEME_COLORS.primary,
    dark: THEME_COLORS.dark,
    background: THEME_COLORS.background,
    accent: THEME_COLORS.accent,
  },
  dark: {
    id: 'dark',
    name: 'Dark Navy Night Mode',
    isDark: true,
    primary: THEME_COLORS.primary,
    dark: THEME_COLORS.dark,
    background: THEME_COLORS.dark,
    accent: THEME_COLORS.accent,
  }
};
