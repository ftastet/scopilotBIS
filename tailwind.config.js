/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1e40af',
        'primary-dark': '#1e3a8a',
        secondary: '#f3f4f6',
        'secondary-dark': '#374151',
        background: '#f9fafb',
        'background-dark': '#1f2937',
        text: '#111827',
        'text-dark': '#f9fafb',
        accent: '#f59e0b',
        'accent-dark': '#d97706',
      },
      width: {
        '144': '36rem', // 576px (320px * 1.8 = 576px)
      },
    },
  },
  plugins: [],
}