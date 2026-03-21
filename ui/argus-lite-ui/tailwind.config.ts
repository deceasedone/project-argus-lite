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
        outfit: ['var(--font-outfit)', 'sans-serif'],
        mono:   ['var(--font-mono)', 'monospace'],
        sans:   ['var(--font-outfit)', 'sans-serif'],
      },
      colors: {
        ae: {
          bg:         '#0d0d0f',
          surface:    '#111114',
          card:       '#16161a',
          'card-hi':  '#1c1c22',
          border:     '#222228',
          'border-hi':'#2e2e38',
          text:       '#e8e6e1',
          sub:        '#9492a0',
          dim:        '#44424e',
          deeper:     '#0a0a0c',
        },
      },
      keyframes: {
        'fade-up': {
          from: { opacity: '0', transform: 'translateY(16px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          from: { opacity: '0' },
          to:   { opacity: '1' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.45s cubic-bezier(0.16,1,0.3,1) both',
        'fade-in': 'fade-in 0.3s ease both',
        shimmer:   'shimmer 2.2s linear infinite',
      },
    },
  },
  plugins: [],
}

export default config