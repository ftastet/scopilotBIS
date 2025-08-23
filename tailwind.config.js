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
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        muted: 'hsl(var(--muted))',
        card: 'hsl(var(--card))',
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        primary: '#3b82f6',
        secondary: '#f9fafb',
        text: '#111827',
      },
      width: {
        '144': '36rem', // 576px (320px * 1.8 = 576px)
      },
    },
  },
  plugins: [],
}