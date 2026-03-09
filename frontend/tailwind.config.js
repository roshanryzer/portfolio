/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        // Refined dark theme
        navy: {
          DEFAULT: '#0e1729',
          light: '#1e293b',
          lighter: '#334155',
          soft: '#0f172a',
        },
        surface: {
          DEFAULT: '#f8fafc',
          dark: '#151b28',
        },
        // Text on dark bg (avoid overriding default slate)
        ink: {
          light: '#e2e8f0',
          muted: '#94a3b8',
          soft: '#cbd5e1',
        },
        accent: {
          // main brand lime
          DEFAULT: '#c5ff41',
          soft: '#e2ff99',
          dim: 'rgba(197, 255, 65, 0.12)',
          glow: 'rgba(197, 255, 65, 0.3)',
        },
        primary: {
          50: '#f7fee7',
          100: '#ecfccb',
          200: '#d9f99d',
          300: '#bef264',
          400: '#a3e635',
          500: '#84cc16',
          600: '#65a30d',
          700: '#4d7c0f',
          800: '#3f6212',
          900: '#365314',
        },
      },
      boxShadow: {
        'card': '0 4px 24px -4px rgba(0, 0, 0, 0.08)',
        'card-dark': '0 4px 24px -4px rgba(0, 0, 0, 0.4)',
        'glow': '0 0 40px -8px rgba(34, 211, 238, 0.2)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
      },
      keyframes: {
        fadeIn: { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        slideUp: { '0%': { opacity: '0', transform: 'translateY(20px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
      },
    },
  },
  plugins: [],
};
