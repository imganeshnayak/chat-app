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
                "primary": "#6c2bee",
                "background-light": "#f6f6f8",
                "background-dark": "#0a0812",
                "surface-dark": "#161126",
            },
            fontFamily: {
                "display": ["Inter", "sans-serif"]
            },
            borderRadius: {
                "DEFAULT": "1rem",
                "lg": "2rem",
                "xl": "3rem",
            },
            backgroundImage: {
                'luxury-gradient': 'linear-gradient(to bottom right, #161022, #0f0b18)',
                'glass-gradient': 'linear-gradient(180deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.01) 100%)',
            },
            boxShadow: {
                'glow': '0 0 40px -10px rgba(108, 43, 238, 0.3)',
                'glow-hover': '0 0 60px -5px rgba(108, 43, 238, 0.5)',
            }
        },
    },
    plugins: [],
}
