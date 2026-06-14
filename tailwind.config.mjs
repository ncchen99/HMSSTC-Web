/** @type {import('tailwindcss').Config} */
export default {
    content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
    theme: {
        extend: {
            colors: {
                // --- Neutrals: warm-leaning deep navy (not pure black) ---
                'space-dark': '#0B1020',
                'space-deep': '#141C30',
                // --- Primary: mission blue ---
                'primary': '#1E40AF',
                'primary-light': '#3B82F6',
                // --- Accent: a single deliberate warm gold (the site's second color) ---
                'accent': '#E0913A',
                'accent-light': '#F2B45E',
                // --- Honest aliases for the primary blue ---
                'tech-blue': '#1E40AF',
                'tech-blue-light': '#3B82F6',
                // --- Deprecated template names kept as aliases so existing classes
                //     keep working; they now resolve to the gold accent (or a blue
                //     tint) instead of the old fake green/orange/yellow ---
                'neon-green': '#E0913A',
                'neon-green-light': '#F2B45E',
                'accent-orange': '#E0913A',
                'accent-yellow': '#F2B45E',
                'accent-teal': '#93C5FD',
                'accent-sky': '#EFF6FF',
            },
            boxShadow: {
                // Restrained, navy-tinted card shadows (replaces the pillowy lg/2xl defaults)
                'card': '0 1px 2px rgba(11, 16, 32, 0.06), 0 6px 16px -4px rgba(11, 16, 32, 0.10)',
                'card-hover': '0 4px 10px -2px rgba(11, 16, 32, 0.10), 0 16px 32px -8px rgba(11, 16, 32, 0.16)',
            },
            fontFamily: {
                display: ['Orbitron', 'Noto Sans TC', 'sans-serif'],
                heading: ['Exo', 'Noto Sans TC', 'sans-serif'],
                body: ['Helvetica', 'Arial', 'Roboto', 'Noto Sans TC', 'sans-serif'],
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
