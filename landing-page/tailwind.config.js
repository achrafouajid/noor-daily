/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                'bg-deep': '#020c1b',
                'bg-card': '#0a192f',
                'gold': '#d4af37',
                'gold-dim': '#b8962e',
                'text-primary': '#e6f1ff',
                'text-secondary': '#8892b0',
            },
            fontFamily: {
                'display': ['Cinzel', 'serif'],
                'body': ['Outfit', 'sans-serif'],
            }
        },
    },
    plugins: [],
}
