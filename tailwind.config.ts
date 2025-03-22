import type { Config } from "tailwindcss";
import lineClamp from "@tailwindcss/line-clamp";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      borderColor: {
        light: "var(--border-light)",
        medium: "var(--border-medium)",
        dark: "var(--border-dark)",
      },
      colors: {
        "background-side-menu": "var(--background-side-menu)",          
        "background-main": "var(--background-main)",                    
        "background-main-card": "var(--background-main-card)",          
        "background-main-card-hover": "var(--background-main-card-hover)", 
        "background-main-card-selected": "var(--background-main-card-selected)", 
        "background-secondary": "var(--background-secondary)",          
        "background-secondary-card": "var(--background-secondary-card)", 
        "background-secondary-card-hover": "var(--background-secondary-card-hover)", 
        "background-secondary-card-selected": "var(--background-secondary-card-selected)", 
        "foreground-main": "var(--foreground-main)",                    
        "foreground-secondary": "var(--foreground-secondary)",         
        "border-light": "var(--border-light)",                          
        "border-medium": "var(--border-medium)",                      
        "border-dark": "var(--border-dark)",  
        "template-color-primary": "var(--template-color-primary)",             
        "template-color-secondary": "var(--template-color-secondary)",  
      },
      animation: {
        "spin-slow": "spin 4s linear infinite",
        "bounce-slow": "bounce 2s infinite",
        "pulse-color": "pulseColor 2s infinite",
      },
      keyframes: {
        pulseColor: {
          "0%, 100%": { filter: "brightness(1)" },
          "50%": { filter: "brightness(1.5)" },
        },
      },
      spacing: {
        "header-height": "4rem",
      },
      fontFamily: {
        sans: "var(--font-inter)", // Primary font
        serif: "var(--font-playfair)", // Secondary font
      }
    },
  },
  plugins: [lineClamp],
} satisfies Config;
