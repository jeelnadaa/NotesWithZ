/** @type {import('tailwindcss').Config} */
export default {
    darkMode: 'class',
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['Satoshi', 'Inter', 'sans-serif'],
                mono: ['JetBrains Mono', 'monospace'],
            },
            borderRadius: {
                '3xl': '1.5rem',
                '4xl': '2rem', // Super soft corners
            },
            colors: {
                // Light Mode
                cream: {
                    50: '#FFFDF9', // Warm off-white
                    100: '#F5F2EB', // Slightly darker cream (Sidebar)
                    200: '#EBE7DD',
                    300: '#E0DBD2',
                },
                coral: {
                    DEFAULT: 'rgb(var(--color-primary) / <alpha-value>)', // Dynamic Accent
                    hover: 'rgb(var(--color-primary-hover) / <alpha-value>)',
                },
                sky: {
                    DEFAULT: '#A2D2FF', // Secondary
                },
                // Dark Mode
                dark: {
                    bg: '#121212',
                    sidebar: '#1A1A1A', // Dark Charcoal
                    surface: '#242424',
                    text: '#F5F5F5',
                },
                // Note Colors (Light / Dark)
                note: {
                    pink: { light: '#FFC8DD', dark: '#4A2A36' },   // Blush
                    blue: { light: '#BDE0FE', dark: '#2A3C4F' },   // Baby Blue
                    green: { light: '#D0F4DE', dark: '#2F4538' },  // Mint
                    yellow: { light: '#FFF1C1', dark: '#4D462E' }, // Butter
                    purple: { light: '#E2D4F5', dark: '#3D2E4F' }, // Lavender
                    orange: { light: '#FFD8BE', dark: '#4F3624' }, // Peach
                    teal: { light: '#C2F0F0', dark: '#264949' },   // Aqua
                    white: { light: '#FFFFFF', dark: '#2A2A2A' },
                }
            },
            animation: {
                'fadeIn': 'fadeIn 0.4s cubic-bezier(0.2, 0.8, 0.2, 1) forwards',
                'scaleIn': 'scaleIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) forwards', // Bouncy
                'hover-float': 'float 3s ease-in-out infinite',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0', transform: 'translateY(10px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                scaleIn: {
                    '0%': { opacity: '0', transform: 'scale(0.9)' },
                    '100%': { opacity: '1', transform: 'scale(1)' },
                },
                float: {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-4px)' },
                }
            },
            boxShadow: {
                'soft': '0 8px 30px rgba(0,0,0,0.04)',
                'soft-dark': '0 8px 30px rgba(0,0,0,0.4)',
            }
        },
    },
    plugins: [],
}
