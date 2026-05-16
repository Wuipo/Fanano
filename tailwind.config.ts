import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bosco: {
          50: "#f1f6f1",
          100: "#dde9dd",
          200: "#bcd3bc",
          300: "#92b692",
          400: "#669766",
          500: "#487a48",
          600: "#386138",
          700: "#2e4e2e",
          800: "#283f28",
          900: "#223422",
        },
        legno: {
          50: "#faf6f0",
          100: "#f0e6d6",
          200: "#e0cba9",
          300: "#cda876",
          400: "#bd8b50",
          500: "#a9743f",
          600: "#8e5d34",
          700: "#72482d",
          800: "#5f3d2a",
          900: "#513526",
        },
      },
      fontFamily: {
        sans: ["system-ui", "-apple-system", "Segoe UI", "Roboto", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
