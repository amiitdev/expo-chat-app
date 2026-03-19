/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all files that contain Nativewind classes.
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        // ==============================
        // PRIMARY BRAND COLORS
        // ==============================

        primary: '#7C6CFF',
        'primary-dark': '#5A4BD1',
        'primary-light': '#A29BFE',
        'primary-glow': '#9F8CFF',

        // ==============================
        // DARK BACKGROUND SYSTEM
        // ==============================

        background: '#0B0B12',
        'background-dark': '#050507',
        'background-light': '#141420',

        // ==============================
        // SURFACE / CARD COLORS
        // ==============================

        surface: '#151520',
        'surface-dark': '#0F0F18',
        'surface-light': '#1C1C2A',
        'surface-glass': '#1F1F2E',

        // ==============================
        // TEXT COLORS
        // ==============================

        foreground: '#FFFFFF',
        'foreground-muted': '#B4B6C5',
        'foreground-subtle': '#7C7F92',
        'foreground-disabled': '#4E5063',

        // ==============================
        // ACCENT COLORS
        // ==============================

        accent: '#FF6B6B',
        'accent-secondary': '#00D4AA',
        'accent-purple': '#8E7CFF',
        'accent-pink': '#FF7EDB',

        // ==============================
        // STATUS COLORS
        // ==============================

        success: '#00D4AA',
        warning: '#FFD166',
        danger: '#FF5C8A',
        info: '#4DA3FF',

        // ==============================
        // BORDERS
        // ==============================

        border: '#26263A',
        'border-light': '#32324A',
        'border-subtle': '#1B1B2B',
      },
    },
  },
  plugins: [],
};
