/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1e40af',
        secondary: '#f3f4f6',
        background: '#f9fafb',
        text: '#111827',
        accent: '#f59e0b',
        surface: '#ffffff',
        'surface-dark': '#1f2937',
        border: '#e5e7eb',
        'border-dark': '#374151',
        muted: '#6b7280',
        'muted-dark': '#9ca3af',
      },
      width: {
        '144': '36rem', // 576px (320px * 1.8 = 576px)
      },
    },
  },
  plugins: [],
}