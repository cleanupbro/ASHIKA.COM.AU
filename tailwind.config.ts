import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: {
          DEFAULT: "#0D9488", // Teal
          foreground: "#FFFFFF",
        },
        secondary: {
          DEFAULT: "#D97706", // Gold
          foreground: "#FFFFFF",
        },
        accent: "#FEF3C7", // Cream
        'brand-teal': '#0D9488',
        'brand-gold': '#D97706',
        'brand-cream': '#FEF3C7',
        'gray-light': '#F9FAFB',
        'gray-border': '#E5E7EB',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
export default config;
