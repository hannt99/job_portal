/** @type {import('tailwindcss').Config} */
module.exports = {
    mode: 'jit',
    content: [
        './pages/**/*.{js,ts,jsx,tsx,mdx}',
        './components/**/*.{js,ts,jsx,tsx,mdx}',
        './app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            backgroundImage: {
                'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
                'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
            },
            keyframes: {
                fadeIn: {
                    '0%': {
                        opacity: 0,
                        transform: 'translateY(-140px)',
                    },

                    '100%': {
                        opacity: 1,
                        transform: 'translateY(0)',
                    },
                },
            },
            fadeInFromB: {
                '0%': {
                    opacity: 0,
                    transform: 'translateY(300px)',
                },

                '100%': {
                    opacity: 1,
                    transform: 'translateY(0)',
                },
            },
            fadeInFromR: {
                '0%': {
                    opacity: 0,
                    transform: 'translateX(300px)',
                },

                '100%': {
                    opacity: 1,
                    transform: 'translateX(0)',
                },
            },
            animation: {
                fadeIn: 'fadeIn 0.5s ease',
                fadeInFromB: 'fadeInFromB 1s ease',
                fadeInFromR: 'fadeInFromR 1s ease',
            },
        },
    },
    plugins: [],
};
