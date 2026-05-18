/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        // ───────────────────────────────────────────────
        // Primary — Deep Cinematic Blue (الأزرق السينمائي العميق)
        // ───────────────────────────────────────────────
        primary: {
          50: '#E8EDF5',
          100: '#C5D1E6',
          200: '#9FB3D4',
          300: '#7895C2',
          400: '#5A7DB5',
          500: '#3C65A7',
          600: '#2E4F87',
          700: '#1B2A4A', // Brand Dark Blue
          800: '#142038',
          900: '#0D1626',
          950: '#080D1A',
        },

        // ───────────────────────────────────────────────
        // Accent — Luxury Crimson (الأحمر الفاخر)
        // ───────────────────────────────────────────────
        accent: {
          50: '#FDE8EB',
          100: '#F9C5CC',
          200: '#F59EAA',
          300: '#F17788',
          400: '#ED5A6E',
          500: '#C8102E', // Brand Crimson
          600: '#A00D25',
          700: '#780A1C',
          800: '#500713',
          900: '#28030A',
        },

        // ───────────────────────────────────────────────
        // Gold — Champagne Luxury Touch (اللمسة الذهبية الفاخرة)
        // ───────────────────────────────────────────────
        gold: {
          50: '#FAF6EC',
          100: '#F2EAD0',
          200: '#E8D9A8',
          300: '#DDC57C',
          400: '#D2B254',
          500: '#C9A961', // Champagne Gold
          600: '#A88A45',
          700: '#876E32',
          800: '#5E4D22',
          900: '#3A3015',
        },

        // ───────────────────────────────────────────────
        // Cinematic Surfaces (الأسطح السينمائية الداكنة)
        // ───────────────────────────────────────────────
        cinema: {
          black: '#050810',
          deepest: '#080D1A',
          deeper: '#0A0E1A',
          deep: '#0F1729',
          surface: '#141C30',
          elevated: '#1A2540',
          border: 'rgba(201, 169, 97, 0.12)', // Gold border ghost
          divider: 'rgba(255, 255, 255, 0.06)',
        },

        // ───────────────────────────────────────────────
        // Status Colors
        // ───────────────────────────────────────────────
        success: {
          DEFAULT: '#10B981',
          light: '#D1FAE5',
          glow: 'rgba(16, 185, 129, 0.25)',
        },
        warning: {
          DEFAULT: '#F59E0B',
          light: '#FEF3C7',
          glow: 'rgba(245, 158, 11, 0.25)',
        },
        danger: {
          DEFAULT: '#EF4444',
          light: '#FEE2E2',
          glow: 'rgba(239, 68, 68, 0.25)',
        },
      },

      fontFamily: {
        cairo: ['Cairo', 'system-ui', 'sans-serif'],
        sans: ['Cairo', 'system-ui', 'sans-serif'],
      },

      fontWeight: {
        thin: '200',
        light: '300',
        normal: '400',
        medium: '500',
        semibold: '600',
        bold: '700',
        extrabold: '800',
        black: '900',
      },

      // ───────────────────────────────────────────────
      // Cinematic Shadows & Glows
      // ───────────────────────────────────────────────
      boxShadow: {
        // Standard cards
        card: '0 2px 12px rgba(27, 42, 74, 0.08)',
        'card-hover': '0 4px 24px rgba(27, 42, 74, 0.12)',
        elevated: '0 8px 32px rgba(27, 42, 74, 0.16)',

        // Cinematic luxury shadows
        cinema: '0 24px 64px -16px rgba(0, 0, 0, 0.5), 0 8px 24px -8px rgba(0, 0, 0, 0.3)',
        'cinema-lg': '0 32px 96px -24px rgba(0, 0, 0, 0.7), 0 12px 32px -8px rgba(0, 0, 0, 0.4)',

        // Glow effects
        'glow-gold': '0 0 24px rgba(201, 169, 97, 0.35), 0 0 64px rgba(201, 169, 97, 0.15)',
        'glow-gold-sm': '0 0 16px rgba(201, 169, 97, 0.4)',
        'glow-blue': '0 0 32px rgba(60, 101, 167, 0.4), 0 0 64px rgba(60, 101, 167, 0.15)',
        'glow-crimson': '0 0 24px rgba(200, 16, 46, 0.4), 0 0 56px rgba(200, 16, 46, 0.18)',

        // Inner luxury
        'inner-luxury': 'inset 0 1px 0 rgba(255, 255, 255, 0.08), inset 0 0 32px rgba(201, 169, 97, 0.04)',
      },

      // ───────────────────────────────────────────────
      // Cinematic Background Images & Gradients
      // ───────────────────────────────────────────────
      backgroundImage: {
        'cinema-radial':
          'radial-gradient(ellipse 100% 60% at 50% 0%, rgba(60, 101, 167, 0.18) 0%, transparent 60%), radial-gradient(ellipse 80% 50% at 50% 100%, rgba(201, 169, 97, 0.10) 0%, transparent 60%)',
        'cinema-hero':
          'linear-gradient(135deg, #050810 0%, #0F1729 45%, #0A0E1A 100%)',
        'cinema-card':
          'linear-gradient(180deg, rgba(20, 28, 48, 0.85) 0%, rgba(10, 14, 26, 0.95) 100%)',
        'gold-gradient':
          'linear-gradient(135deg, #DDC57C 0%, #C9A961 50%, #876E32 100%)',
        'gold-text':
          'linear-gradient(135deg, #F2EAD0 0%, #C9A961 50%, #DDC57C 100%)',
        'crimson-gradient':
          'linear-gradient(135deg, #ED5A6E 0%, #C8102E 100%)',
        'mesh-luxury':
          'radial-gradient(at 20% 0%, rgba(60, 101, 167, 0.25) 0%, transparent 50%), radial-gradient(at 80% 0%, rgba(201, 169, 97, 0.15) 0%, transparent 50%), radial-gradient(at 50% 100%, rgba(200, 16, 46, 0.12) 0%, transparent 50%)',
      },

      // ───────────────────────────────────────────────
      // Border Radius & Spacing
      // ───────────────────────────────────────────────
      borderRadius: {
        card: '14px',
        button: '10px',
        'card-lg': '20px',
        cinema: '24px',
      },

      // ───────────────────────────────────────────────
      // Typography Scale
      // ───────────────────────────────────────────────
      letterSpacing: {
        tightest: '-0.04em',
        cinema: '-0.02em',
        wide: '0.02em',
        widest: '0.18em',
      },

      // ───────────────────────────────────────────────
      // Animations (Cinematic motion)
      // ───────────────────────────────────────────────
      keyframes: {
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'glow-pulse': {
          '0%, 100%': { opacity: '0.6' },
          '50%': { opacity: '1' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
        'gradient-shift': {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
      },
      animation: {
        'fade-in-up': 'fade-in-up 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'fade-in': 'fade-in 0.5s ease-out forwards',
        'glow-pulse': 'glow-pulse 3s ease-in-out infinite',
        shimmer: 'shimmer 2.5s linear infinite',
        'gradient-shift': 'gradient-shift 8s ease infinite',
        float: 'float 6s ease-in-out infinite',
      },

      backdropBlur: {
        cinema: '20px',
      },
    },
  },
  plugins: [],
};
