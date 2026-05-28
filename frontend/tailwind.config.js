/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'sans-serif'],
        display: ['"Lora"', 'Georgia', 'serif'],
      },
      colors: {
        accent: {
          DEFAULT: '#a05a2c',
          dark: '#7a4420',
          light: '#c47a4a',
        },
        glass: {
          bg: 'rgba(255, 255, 255, 0.45)',
          'bg-hover': 'rgba(255, 255, 255, 0.6)',
          border: 'rgba(255, 255, 255, 0.5)',
          'border-hover': 'rgba(255, 255, 255, 0.8)',
          inset: 'rgba(255, 255, 255, 0.6)',
          'inset-hover': 'rgba(255, 255, 255, 0.85)',
        },
        sidebar: {
          active: '#a05a2c',
          'active-text': '#ffffff',
        },
        primary: {
          glow: 'rgba(160, 90, 44, 0.08)',
        },
      },
      backdropBlur: {
        glass: '24px',
      },
      borderRadius: {
        glass: '20px',
      },
      animation: {
        'ym-blink': 'ymBlink 1.2s infinite ease-in-out both',
      },
      keyframes: {
        ymBlink: {
          '0%, 80%, 100%': { opacity: '0.25', transform: 'scale(0.85)' },
          '40%': { opacity: '1', transform: 'scale(1)' },
        },
      },
    },
  },
  plugins: [],
}