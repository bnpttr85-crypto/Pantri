import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Warm, earthy palette
        cream: {
          50: '#FFFDF7',
          100: '#FDF9ED',
          200: '#F9F0D9',
          300: '#F3E4BE',
        },
        sage: {
          50: '#F4F7F4',
          100: '#E4ECE4',
          200: '#C8D9C8',
          300: '#A3BFA3',
          400: '#7BA37B',
          500: '#5C875C',
          600: '#486B48',
          700: '#3A553A',
          800: '#2F442F',
          900: '#273827',
        },
        terracotta: {
          50: '#FEF6F3',
          100: '#FCE8E1',
          200: '#F9D1C4',
          300: '#F4AD98',
          400: '#EC8162',
          500: '#E05D3A',
          600: '#CC4427',
          700: '#AA3620',
          800: '#8B2F1F',
          900: '#732B1F',
        },
        stone: {
          50: '#FAFAF9',
          100: '#F5F5F4',
          200: '#E7E5E4',
          300: '#D6D3D1',
          400: '#A8A29E',
          500: '#78716C',
          600: '#57534E',
          700: '#44403C',
          800: '#292524',
          900: '#1C1917',
        },
      },
      fontFamily: {
        display: ['var(--font-display)', 'serif'],
        body: ['var(--font-body)', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
