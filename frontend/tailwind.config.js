/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        civic: {
          50: '#f0f7ff',
          100: '#e0effe',
          200: '#bae0fd',
          300: '#7cc8fc',
          400: '#38aef9',
          500: '#0e94eb',
          600: '#0276c7',
          700: '#035ea1',
          800: '#075085',
          900: '#0c436e',
          950: '#082b49',
        }
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 5px rgba(14, 148, 235, 0.2), 0 0 10px rgba(14, 148, 235, 0.2)' },
          '100%': { boxShadow: '0 0 15px rgba(14, 148, 235, 0.6), 0 0 20px rgba(14, 148, 235, 0.4)' },
        }
      }
    },
  },
  plugins: [],
  darkMode: 'class',
}
