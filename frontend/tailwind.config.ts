import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#eef4ff",
          100: "#dbe7ff",
          200: "#b9d1ff",
          300: "#8fb3ff",
          400: "#5f8cff",
          500: "#3763f4",   // primario
          600: "#2748d6",
          700: "#2038ac",
          800: "#1e3189",
          900: "#1c2c6f",
        },
        accent: {
          500: "#f4a13a", // acento cálido para CTAs secundarios / alertas
        },
        surface: {
          light: "#f7f8fb",
          dark: "#0f1420",
          cardDark: "#161c2c",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "sans-serif"],
        body: ["var(--font-body)", "sans-serif"],
      },
      borderRadius: {
        xl: "0.875rem",
        "2xl": "1.25rem",
      },
      boxShadow: {
        card: "0 1px 2px rgba(16,24,40,.04), 0 1px 3px rgba(16,24,40,.06)",
      },
    },
  },
  plugins: [],
};
export default config;
