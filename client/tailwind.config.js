/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                // Primary Palette
                primary: {
                    DEFAULT: '#8b5cf6',
                    light: '#a78bfa',
                    dark: '#7c3aed',
                    50: '#f5f3ff',
                    100: '#ede9fe',
                    200: '#ddd6fe',
                    300: '#c4b5fd',
                    400: '#a78bfa',
                    500: '#8b5cf6',
                    600: '#7c3aed',
                    700: '#6d28d9',
                    800: '#5b21b6',
                    900: '#4c1d95',
                },
                // Secondary Palette
                secondary: {
                    DEFAULT: '#06b6d4',
                    light: '#22d3ee',
                    dark: '#0891b2',
                    50: '#ecfeff',
                    100: '#cffafe',
                    200: '#a5f3fc',
                    300: '#67e8f9',
                    400: '#22d3ee',
                    500: '#06b6d4',
                    600: '#0891b2',
                    700: '#0e7490',
                    800: '#155e75',
                    900: '#164e63',
                },
                // Category Colors
                clothes: '#8b5cf6',
                shoes: '#f97316',
                bags: '#ec4899',
                accessories: '#14b8a6',
                // Neutral
                dark: {
                    DEFAULT: '#0a0f1e',
                    deep: '#030712',
                    card: '#111827',
                    elevated: '#1f2937',
                },
                light: '#f9fafb',
            },
            fontFamily: {
                sans: ['"Inter"', '"Plus Jakarta Sans"', '"Space Grotesk"', 'system-ui', 'sans-serif'],
                display: ['"Plus Jakarta Sans"', '"Inter"', 'system-ui', 'sans-serif'],
            },
            borderRadius: {
                '4xl': '2rem',
                '5xl': '2.5rem',
            },
            boxShadow: {
                'glow': '0 0 40px rgba(139, 92, 246, 0.15)',
                'glow-lg': '0 0 60px rgba(139, 92, 246, 0.25)',
                'glow-primary': '0 0 40px rgba(139, 92, 246, 0.4)',
                'glow-secondary': '0 0 40px rgba(6, 182, 212, 0.4)',
                'inner-glow': 'inset 0 0 20px rgba(139, 92, 246, 0.1)',
            },
            animation: {
                'fade-in': 'fadeIn 0.3s ease-out',
                'fade-in-up': 'fadeInUp 0.4s ease-out',
                'fade-in-down': 'fadeInDown 0.4s ease-out',
                'scale-in': 'scaleIn 0.3s ease-out',
                'slide-in-right': 'slideInRight 0.4s ease-out',
                'slide-in-left': 'slideInLeft 0.4s ease-out',
                'float': 'float 3s ease-in-out infinite',
                'glow-pulse': 'glowPulse 2s ease-in-out infinite',
                'shimmer': 'shimmer 2s infinite',
                'gradient': 'gradient 3s ease infinite',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                fadeInUp: {
                    '0%': { opacity: '0', transform: 'translateY(20px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                fadeInDown: {
                    '0%': { opacity: '0', transform: 'translateY(-20px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                scaleIn: {
                    '0%': { opacity: '0', transform: 'scale(0.95)' },
                    '100%': { opacity: '1', transform: 'scale(1)' },
                },
                slideInRight: {
                    '0%': { opacity: '0', transform: 'translateX(30px)' },
                    '100%': { opacity: '1', transform: 'translateX(0)' },
                },
                slideInLeft: {
                    '0%': { opacity: '0', transform: 'translateX(-30px)' },
                    '100%': { opacity: '1', transform: 'translateX(0)' },
                },
                float: {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-10px)' },
                },
                glowPulse: {
                    '0%, 100%': { boxShadow: '0 0 20px rgba(139, 92, 246, 0.3)' },
                    '50%': { boxShadow: '0 0 40px rgba(139, 92, 246, 0.5)' },
                },
                shimmer: {
                    '0%': { backgroundPosition: '-200% 0' },
                    '100%': { backgroundPosition: '200% 0' },
                },
                gradient: {
                    '0%': { backgroundPosition: '0% 50%' },
                    '50%': { backgroundPosition: '100% 50%' },
                    '100%': { backgroundPosition: '0% 50%' },
                },
            },
            backdropBlur: {
                xs: '2px',
            },
            transitionDuration: {
                '400': '400ms',
            },
            transitionTimingFunction: {
                'bounce-in': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
            },
        },
    },
    plugins: [],
}
