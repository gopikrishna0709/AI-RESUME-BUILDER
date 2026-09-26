/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Primary: Deep Plum / Burgundy
        plum: {
          50: '#FAF4F6',
          100: '#F5E8EC',
          200: '#EBD2DA',
          300: '#DBB0BD',
          400: '#C28599',
          500: '#A45D75',
          600: '#864056',
          700: '#6E3144',
          800: '#5A2636',
          900: '#4A1525',
          950: '#2A0C15',
        },
        // Accent: Warm Coral / Terracotta
        terracotta: {
          50: '#FCEDE8',
          100: '#F9DDD3',
          200: '#F2B9A8',
          300: '#E99279',
          400: '#E06D53',
          500: '#D95D39',
          600: '#C84B31',
          700: '#A73822',
          800: '#862D1C',
          900: '#6C2517',
          950: '#3D120B',
        },
        // Secondary: Golden Amber
        amber: {
          50: '#FEF8EE',
          100: '#FDF0D7',
          200: '#F9DCAC',
          300: '#F5C478',
          400: '#EFAA46',
          500: '#D9822B',
          600: '#C06B1F',
          700: '#9E5118',
          800: '#7F4016',
          900: '#673516',
          950: '#3A1B0A',
        },
        // Supporting: Soft Sage / Olive
        sage: {
          50: '#F2F6F3',
          100: '#E3EDE6',
          200: '#C7DBCF',
          300: '#A4C3B0',
          400: '#7FA68E',
          500: '#5B8A68',
          600: '#4E785C',
          700: '#3F614A',
          800: '#334F3C',
          900: '#2A4032',
          950: '#15221A',
        },
        // Neutral warm surfaces
        surface: {
          bg: 'var(--surface-bg)',
          card: 'var(--surface-card)',
          elevated: 'var(--surface-elevated)',
          border: 'var(--surface-border)',
          hover: 'var(--surface-hover)',
          text: 'var(--surface-text)',
          muted: 'var(--surface-muted)',
          subtle: 'var(--surface-subtle)',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['Plus Jakarta Sans', 'Inter', 'sans-serif'],
        mono: ['Fira Code', 'monospace'],
      },
      boxShadow: {
        'subtle': '0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px -1px rgba(0, 0, 0, 0.05)',
        'card': '0 4px 6px -1px rgba(0, 0, 0, 0.06), 0 2px 4px -2px rgba(0, 0, 0, 0.04)',
        'lift': '0 10px 15px -3px rgba(0, 0, 0, 0.08), 0 4px 6px -4px rgba(0, 0, 0, 0.03)',
        'modal': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.25rem',
      },
      animation: {
        'fade-in': 'fadeIn 0.25s ease-out forwards',
        'slide-up': 'slideUp 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'card-entrance': 'cardEntrance 0.45s cubic-bezier(0.16, 1, 0.3, 1) both',
        'scale-in': 'scaleIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'pulse-subtle': 'pulseSubtle 2.5s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        cardEntrance: {
          '0%': { opacity: '0', transform: 'translateY(18px) scale(0.98)' },
          '100%': { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        pulseSubtle: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.75' },
        },
      },
    },
  },
  plugins: [],
}

