import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: ['./src/**/*.{ts,tsx,mdx}'],
  theme: {
    container: {
      center: true,
      padding: '1.25rem',
      screens: { '2xl': '1320px' },
    },
    extend: {
      colors: {
        bg: {
          primary: '#0D0C0A',
          secondary: '#1A1814',
          card: '#221F1A',
        },
        accent: {
          gold: '#C8A96E',
          bronze: '#8B6914',
          stone: '#A89880',
          highlight: '#E8C87A',
        },
        ink: {
          primary: '#F2EDE6',
          secondary: '#9C9080',
        },
        line: '#3A3530',
        border: '#3A3530',
        ring: '#C8A96E',
        background: '#0D0C0A',
        foreground: '#F2EDE6',
        muted: { DEFAULT: '#1A1814', foreground: '#9C9080' },
        primary: { DEFAULT: '#C8A96E', foreground: '#0D0C0A' },
        secondary: { DEFAULT: '#221F1A', foreground: '#F2EDE6' },
        destructive: { DEFAULT: '#9b2c2c', foreground: '#F2EDE6' },
        accent2: { DEFAULT: '#221F1A', foreground: '#F2EDE6' },
        popover: { DEFAULT: '#1A1814', foreground: '#F2EDE6' },
        card: { DEFAULT: '#221F1A', foreground: '#F2EDE6' },
        input: '#3A3530',
      },
      fontFamily: {
        display: ['var(--font-playfair)', 'serif'],
        serif: ['var(--font-cormorant)', 'serif'],
        cinzel: ['var(--font-cinzel)', 'serif'],
        sans: ['var(--font-lato)', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'grain': "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0.12 0 0 0 0 0.10 0 0 0 0 0.08 0 0 0 0.55 0'/></filter><rect width='100%' height='100%' filter='url(%23n)' opacity='0.18'/></svg>\")",
        'gold-radial': 'radial-gradient(60% 60% at 50% 30%, rgba(200,169,110,0.22) 0%, rgba(13,12,10,0) 70%)',
      },
      borderRadius: {
        lg: '14px',
        md: '10px',
        sm: '6px',
      },
      boxShadow: {
        gold: '0 10px 40px -10px rgba(200,169,110,0.35)',
        soft: '0 8px 30px rgba(0,0,0,0.45)',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.7s ease forwards',
        shimmer: 'shimmer 6s linear infinite',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
}

export default config
