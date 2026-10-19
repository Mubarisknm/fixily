/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Primary: #2563EB — Electric/modern blue
        primary: {
          DEFAULT: '#2563eb',
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb', // Electric Blue Primary
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
          950: '#172554',
        },
        brand: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb', // Electric Blue
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
          950: '#172554',
        },
        // Dark: #0F172A — Navy/near-black
        navy: {
          DEFAULT: '#0f172a',
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a', // Dark Navy
          950: '#0a0f1d',
        },
        // Accent: #22C55E — Green for success/availability
        accent: {
          DEFAULT: '#22c55e',
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e', // Green for success/availability
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
        },
        // Background: #F8FAFC — Off-white
        appBg: {
          light: '#f8fafc',
          dark: '#0f172a',
        },
        // Alias slate 950 to Dark Navy (#0F172A) for deep theme harmony
        slate: {
          950: '#0f172a',
        },
        rescue: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
        },
        kerala: {
          green: '#22c55e',
          gold: '#f59e0b',
          navy: '#0f172a',
          blue: '#2563eb',
        },
        // Google Stitch Neon Noir Theme Tokens
        "surface-container": "#1f1f1f",
        "secondary-fixed-dim": "#c8c6c5",
        "tertiary": "#00dbe9",
        "surface-container-lowest": "#0e0e0e",
        "surface-container-high": "#2a2a2a",
        "on-surface": "#e2e2e2",
        "inverse-primary": "#bb0058",
        "outline-variant": "#5c3f45",
        "surface-container-highest": "#353535",
        "on-secondary": "#313030",
        "primary-fixed": "#ffd9e0",
        "on-secondary-container": "#bab8b7",
        "on-tertiary-fixed-variant": "#004f54",
        "on-secondary-fixed": "#1c1b1b",
        "neon-primary": "#ffb1c3",
        "on-surface-variant": "#e5bcc4",
        "tertiary-fixed-dim": "#00dbe9",
        "tertiary-fixed": "#7df4ff",
        "surface-tint": "#ffb1c3",
        "surface-variant": "#353535",
        "on-primary-container": "#590026",
        "surface": "#131313",
        "surface-container-low": "#1b1b1b",
        "surface-bright": "#393939",
        "tertiary-container": "#00a0aa",
        "primary-container": "#ff4b89",
        "on-tertiary": "#00363a",
        "on-primary": "#66002c",
        "surface-dim": "#131313"
      },
      fontFamily: {
        headline: ['"Space Grotesk"', 'sans-serif'],
        body: ['Inter', 'sans-serif']
      }
    },
  },
  plugins: [],
}
