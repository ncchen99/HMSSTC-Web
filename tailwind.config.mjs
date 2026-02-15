/** @type {import('tailwindcss').Config} */
export default {
    content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
    theme: {
        extend: {
            colors: {
                'space-dark': '#02002C',
                'space-deep': '#050520',
                'tech-blue': '#2B66F2',
                'tech-blue-light': '#4A82FF',
                'neon-green': '#66E0A1',
                'neon-green-light': '#8AEFC0',
                'accent-orange': '#F4983B',
                'accent-yellow': '#FAC452',
                'accent-teal': '#8AE7D1',
                'accent-sky': '#8fd3f4',
            },
            fontFamily: {
                display: ['Orbitron', 'sans-serif'],
                heading: ['Exo', 'sans-serif'],
                body: ['Noto Sans TC', 'Helvetica', 'Roboto', 'sans-serif'],
            },
            backgroundImage: {
                'gradient-orange': 'linear-gradient(135deg, #F4983B, #FAC452)',
                'gradient-teal': 'linear-gradient(135deg, #8fd3f4, #8AE7D1)',
                'gradient-blue': 'linear-gradient(135deg, #2B66F2, #4A82FF)',
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
                    '0%, 100%': { opacity: '0.6', boxShadow: '0 0 20px rgba(43, 102, 242, 0.3)' },
                    '50%': { opacity: '1', boxShadow: '0 0 40px rgba(43, 102, 242, 0.6)' },
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
