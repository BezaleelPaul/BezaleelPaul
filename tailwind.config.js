/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: '#111411',
          soft: '#1a1e19',
          muted: '#30352d',
        },
        paper: {
          DEFAULT: '#f1efe7',
          warm: '#e7e4d9',
          bright: '#faf9f4',
        },
        signal: {
          DEFAULT: '#d9ff63',
          soft: '#e8ffa3',
        },
        graphite: '#30352d',
        line: '#cbccc0',
        'line-dark': '#3a4036',
        space: {
          900: '#02040a',
          800: '#060c18',
          700: '#0b162c',
          card: 'rgba(11, 22, 44, 0.75)',
          950: '#02040a',
        },
        hud: {
          cyan: '#00f3ff',
          amber: '#ffb703',
          emerald: '#10b981',
          crimson: '#ff3366',
          violet: '#a855f7',
        }
      },
      fontFamily: {
        display: ['Instrument Serif', 'Georgia', 'serif'],
        body: ['Manrope', 'Segoe UI', 'sans-serif'],
        sans: ['Manrope', 'Segoe UI', 'sans-serif'],
        mono: ['JetBrains Mono', 'Consolas', 'monospace'],
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow': 'spin 30s linear infinite',
      }
    },
  },
  plugins: [],
};
