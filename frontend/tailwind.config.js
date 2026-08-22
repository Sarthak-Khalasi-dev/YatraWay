/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: {
          DEFAULT: '#F4F0E8',
          mid: '#F8F5EE',
          dark: '#EBE6DA',
        },
        gold: {
          DEFAULT: '#C9963A',
          light: '#E8C470',
          muted: 'rgba(201,150,58,0.15)',
        },
        charcoal: {
          DEFAULT: '#1A1F2E',
          mid: '#252D3D',
          light: '#2E3850',
        },
        text: {
          dark: '#1C1C1E',
          mid: '#6B7280',
          light: '#9CA3AF',
        },
        border: {
          DEFAULT: 'rgba(0,0,0,0.09)',
          light: 'rgba(0,0,0,0.06)',
        }
      },
      fontFamily: {
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        body: ['"DM Sans"', 'Inter', 'sans-serif'],
      },
      boxShadow: {
        DEFAULT: '0 8px 40px rgba(0,0,0,0.12)',
        sm: '0 2px 12px rgba(0,0,0,0.08)',
        lg: '0 20px 60px rgba(0,0,0,0.16)',
      },
      transitionTimingFunction: {
        'ease-out': 'cubic-bezier(0.16, 1, 0.3, 1)',
        'ease-in-out': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: 0, transform: 'translateY(22px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
        fadeDown: {
          '0%': { opacity: 0, transform: 'translateY(-14px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
        fadeRight: {
          '0%': { opacity: 0, transform: 'translateX(-14px)' },
          '100%': { opacity: 1, transform: 'translateX(0)' },
        },
        spin: {
          'to': { transform: 'rotate(360deg)' }
        }
      },
      animation: {
        fadeUp: 'fadeUp 0.75s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        fadeDown: 'fadeDown 0.65s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        fadeRight: 'fadeRight 0.55s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        spin: 'spin 0.75s linear infinite',
      }
    },
  },
  plugins: [],
}
