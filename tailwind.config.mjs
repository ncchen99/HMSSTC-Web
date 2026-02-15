/** @type {import('tailwindcss').Config} */
export default {
    content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
    theme: {
        extend: {
            colors: {
                'space-dark': '#030712',
                'space-deep': '#0F172A',
                'tech-blue': '#1E40AF',
                'tech-blue-light': '#3B82F6',
                'neon-green': '#2563EB',
                'neon-green-light': '#60A5FA',
                'accent-orange': '#1D4ED8',
                'accent-yellow': '#93C5FD',
                'accent-teal': '#DBEAFE',
                'accent-sky': '#EFF6FF',
            },
            fontFamily: {
                display: ['Orbitron', 'sans-serif'],
                heading: ['Exo', 'sans-serif'],
                body: ['Noto Sans TC', 'Helvetica', 'Roboto', 'sans-serif'],
            },
            backgroundImage: {
                'gradient-orange': 'linear-gradient(135deg, #1E40AF, #93C5FD)',
                'gradient-teal': 'linear-gradient(135deg, #60A5FA, #DBEAFE)',
                'gradient-blue': 'linear-gradient(135deg, #1E40AF, #3B82F6)',
            },
            animation: {
                'float': 'float 6s ease-in-out infinite',
                'float-slow': 'float 8s ease-in-out infinite',
                'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
                'scroll-hint': 'scrollHint 2s ease-in-out infinite',
                'fade-in-up': 'fadeInUp 0.6s ease-out forwards',
                'count-up': 'fadeInUp 0.8s ease-out forwards',
                'slide-in-left': 'slideInLeft 0.6s ease-out forwards',
                'slide-in-right': 'slideInRight 0.6s ease-out forwards',
            },
            keyframes: {
                float: {
                    '0%, 100%': { transform: 'translateY(0px)' },
                    '50%': { transform: 'translateY(-20px)' },
                },
                pulseGlow: {
                    '0%, 100%': { opacity: '0.6', boxShadow: '0 0 20px rgba(30, 64, 175, 0.3)' },
                    '50%': { opacity: '1', boxShadow: '0 0 40px rgba(30, 64, 175, 0.6)' },
                },
                scrollHint: {
                    '0%': { opacity: '0', transform: 'translateY(-8px)' },
                    '50%': { opacity: '1' },
                    '100%': { opacity: '0', transform: 'translateY(8px)' },
                },
                fadeInUp: {
                    '0%': { opacity: '0', transform: 'translateY(30px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                slideInLeft: {
                    '0%': { opacity: '0', transform: 'translateX(-30px)' },
                    '100%': { opacity: '1', transform: 'translateX(0)' },
                },
                slideInRight: {
                    '0%': { opacity: '0', transform: 'translateX(30px)' },
                    '100%': { opacity: '1', transform: 'translateX(0)' },
                },
            },
        },
    },
    plugins: [require('@tailwindcss/typography')],
};
