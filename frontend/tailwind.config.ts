import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          dark: '#011478',
          light: '#fefefe'
        },
        accent: '#f9cd2a',
        brand: {
          blue: '#011478',
          white: '#fefefe',
          yellow: '#f9cd2a'
        }
      },
      fontFamily: {
        script: ['ITC Edwardian Script', 'cursive'],
        sans: ['DM Sans', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['DM Sans', 'ui-sans-serif', 'system-ui', 'sans-serif']
      }
    }
  },
  plugins: []
};

export default config;
