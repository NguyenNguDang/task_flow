export default {
    content: [
        './public/**/*.html',
        './src/**/*.{js,jsx,ts,tsx,vue}',
    ],
    theme: {
        extend: {
            colors: {
                primary: "#0d69f2",
                "background-light": "#f5f7f8",
                "background-dark": "#101722",
            },
            fontFamily: {
                display: ["Inter", "sans-serif"],
            },
        },
    },
    plugins: [],
}