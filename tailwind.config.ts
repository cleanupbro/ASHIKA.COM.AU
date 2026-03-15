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
          DEFAULT: "#0A0A0A", // Black (GlamCorner aesthetic)
          foreground: "#FFFFFF",
        },
        secondary: {
          DEFAULT: "#C8A951", // Refined Gold
          foreground: "#000000",
        },
        accent: "#F5F0E8", // Warm Cream
        'brand-tan': '#DDC4B1',
        'brand-beige': '#F5F5F4',
        'brand-offwhite': '#FAFAFA',
        'brand-black': '#0A0A0A',
        'brand-gold': '#C8A951',
        'brand-cream': '#F5F0E8',
        // brand-teal removed — fully migrated to brand-black (#0A0A0A)
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
