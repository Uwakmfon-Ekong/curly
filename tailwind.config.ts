import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
        display: ['Syne', 'sans-serif'],
      },
      colors: {
        bg:       '#0a0b0e',
        surface:  '#111318',
        surface2: '#191c23',
        border1:  '#222530',
        border2:  '#2d3142',
        accent:   '#3dffc0',
        accent2:  '#7c6dff',
        muted:    '#5a6070',
        danger:   '#ff5f70',
        warn:     '#ffd166',
        info:     '#56b4ff',
      },
      animation: {
        'fade-down': 'fadeDown 0.5s ease both',
        'fade-up':   'fadeUp 0.5s ease both',
      },
      keyframes: {
        fadeDown: {
          from: { opacity: '0', transform: 'translateY(-10px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        fadeUp: {
          from: { opacity: '0', transform: 'translateY(10px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}

export default config
