import { fontFamily } from 'tailwindcss/defaultTheme';

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Inter Variable"', ...fontFamily.sans],
        mono: ['"JetBrains Mono Variable"', ...fontFamily.mono],
      },
      colors: {
        accent: {
          DEFAULT: '#0d9488', // teal-600
          hover: '#14b8a6',   // teal-500
        },
        'terminal-green': '#a3e636', // lime-400
      },
      keyframes: {
        fadeIn: {
          from: { opacity: 0, transform: 'translateY(10px)' },
          to: { opacity: 1, transform: 'translateY(0)' },
        },
      },
      animation: {
        fadeIn: 'fadeIn 0.5s ease-out forwards',
      },
    },
  },
  plugins: [],
};
