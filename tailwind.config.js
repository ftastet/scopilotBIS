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
        accent: '#f59e0b',
        surface: '#ffffff',
        'surface-dark': '#1f2937',
        muted: '#f3f4f6',
        'muted-dark': '#374151',
        border: '#d1d5db',
        'border-dark': '#4b5563',
        text: '#111827',
        'text-dark': '#f9fafb',
      },
      width: {
        '144': '36rem', // 576px (320px * 1.8 = 576px)
      },
    },
  },
  plugins: [],
}