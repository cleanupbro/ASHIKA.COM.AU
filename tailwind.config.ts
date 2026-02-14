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
        'brand-tan': '#DDC4B1',
        'brand-beige': '#F5F5F4',
        'brand-offwhite': '#F8FBFA',
        'brand-black': '#1A1A1A',
        'brand-gold': '#D97706', // Retaining for compatibility during transition
        'brand-teal': '#0D9488', // Retaining for compatibility during transition
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'sans-serif'],
      },
      letterSpacing: {
        'widest-plus': '0.3em',
        'hero': '0.4em',
      },
    },
  },
  plugins: [],
};
export default config;
