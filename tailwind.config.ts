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
        forest: {
          DEFAULT: "#0f2318",
          50: "#f0f7f3",
          100: "#dcede3",
          200: "#bcd9c9",
          300: "#90bea6",
          400: "#5f9d7f",
          500: "#3d7f61",
          600: "#2d664c",
          700: "#25513d",
          800: "#1a3d2b",
          900: "#0f2318",
        },
        cream: "#fdf8ef",
        parchment: "#f5edd8",
        gold: {
          DEFAULT: "#c9a84c",
          light: "#e8c97a",
          dark: "#9e7f2e",
        },
        burgundy: {
          DEFAULT: "#722f37",
          light: "#9b4652",
          dark: "#4f1f24",
        },
        ribbon: "#c8102e",
        copper: "#b87333",
        snow: "#f9f5ee",
      },
      fontFamily: {
        display: ["var(--font-playfair)", "Georgia", "serif"],
        body: ["var(--font-lora)", "Georgia", "serif"],
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      animation: {
        "snow-fall": "snowFall linear infinite",
        "float": "float 3s ease-in-out infinite",
        "glow-pulse": "glowPulse 2s ease-in-out infinite",
        "shake": "shake 0.5s ease-in-out",
        "open-box": "openBox 0.6s ease-out forwards",
        "fade-in": "fadeIn 0.6s ease-out forwards",
        "slide-up": "slideUp 0.5s ease-out forwards",
        "sparkle": "sparkle 1.5s ease-in-out forwards",
        "bounce-gentle": "bounceGentle 2s ease-in-out infinite",
        "twinkle": "twinkle 2s ease-in-out infinite",
      },
      keyframes: {
        snowFall: {
          "0%": { transform: "translateY(-10px) rotate(0deg)", opacity: "0" },
          "10%": { opacity: "1" },
          "90%": { opacity: "0.8" },
          "100%": { transform: "translateY(100vh) rotate(360deg)", opacity: "0" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-8px)" },
        },
        glowPulse: {
          "0%, 100%": { boxShadow: "0 0 15px rgba(201, 168, 76, 0.4)" },
          "50%": { boxShadow: "0 0 30px rgba(201, 168, 76, 0.8), 0 0 50px rgba(201, 168, 76, 0.3)" },
        },
        shake: {
          "0%, 100%": { transform: "translateX(0)" },
          "25%": { transform: "translateX(-4px) rotate(-2deg)" },
          "75%": { transform: "translateX(4px) rotate(2deg)" },
        },
        openBox: {
          "0%": { transform: "scaleY(1)" },
          "50%": { transform: "scaleY(1.1)" },
          "100%": { transform: "scaleY(0)" },
        },
        fadeIn: {
          "0%": { opacity: "0", transform: "scale(0.9)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        sparkle: {
          "0%": { transform: "scale(0) rotate(0deg)", opacity: "1" },
          "100%": { transform: "scale(2) rotate(180deg)", opacity: "0" },
        },
        bounceGentle: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-6px)" },
        },
        twinkle: {
          "0%, 100%": { opacity: "1", transform: "scale(1)" },
          "50%": { opacity: "0.4", transform: "scale(0.8)" },
        },
      },
      backgroundImage: {
        "forest-radial": "radial-gradient(ellipse at center, #1a3d2b 0%, #0f2318 70%)",
        "gold-shimmer": "linear-gradient(135deg, #c9a84c 0%, #e8c97a 50%, #c9a84c 100%)",
        "parchment-texture": "linear-gradient(145deg, #fdf8ef 0%, #f5edd8 100%)",
      },
    },
  },
  plugins: [],
};

export default config;
