import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Core dark cinematic palette
        background: {
          DEFAULT: "#080b12",
          secondary: "#0d1117",
          tertiary: "#111827",
          card: "#0f1623",
        },
        surface: {
          DEFAULT: "#141c2b",
          hover: "#1a2436",
          border: "#1e2d42",
        },
        // Brand accent — electric blue/cyan
        accent: {
          DEFAULT: "#00b4d8",
          light: "#48cae4",
          dark: "#0077b6",
          glow: "#00b4d833",
        },
        // Secondary accent — warm purple/violet
        violet: {
          DEFAULT: "#8b5cf6",
          light: "#a78bfa",
          dark: "#7c3aed",
          glow: "#8b5cf633",
        },
        // Highlight orange for CTAs
        orange: {
          DEFAULT: "#f97316",
          light: "#fb923c",
          dark: "#ea580c",
          glow: "#f9731633",
        },
        // Text colors
        text: {
          primary: "#f1f5f9",
          secondary: "#94a3b8",
          muted: "#64748b",
          accent: "#00b4d8",
        },
        // Status colors
        success: "#10b981",
        warning: "#f59e0b",
        error: "#ef4444",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        display: ["'Space Grotesk'", "Inter", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"],
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        "hero-gradient":
          "linear-gradient(135deg, #080b12 0%, #0d1117 40%, #0a1628 70%, #080b12 100%)",
        "card-gradient":
          "linear-gradient(135deg, #0f1623 0%, #141c2b 100%)",
        "accent-gradient":
          "linear-gradient(135deg, #00b4d8 0%, #8b5cf6 100%)",
        "accent-gradient-orange":
          "linear-gradient(135deg, #f97316 0%, #8b5cf6 100%)",
      },
      boxShadow: {
        "glow-accent": "0 0 20px #00b4d833, 0 0 40px #00b4d811",
        "glow-violet": "0 0 20px #8b5cf633, 0 0 40px #8b5cf611",
        "glow-orange": "0 0 20px #f9731633, 0 0 40px #f9731611",
        "card": "0 4px 24px rgba(0,0,0,0.4), 0 1px 0 rgba(255,255,255,0.05) inset",
        "card-hover": "0 8px 40px rgba(0,0,0,0.6), 0 0 0 1px #00b4d822",
        "glass": "0 8px 32px rgba(0,0,0,0.3)",
      },
      borderRadius: {
        "2xl": "1rem",
        "3xl": "1.5rem",
        "4xl": "2rem",
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-in-out",
        "fade-up": "fadeUp 0.6s ease-out",
        "fade-down": "fadeDown 0.5s ease-out",
        "slide-in-left": "slideInLeft 0.5s ease-out",
        "slide-in-right": "slideInRight 0.5s ease-out",
        "float": "float 6s ease-in-out infinite",
        "float-delayed": "float 6s ease-in-out 2s infinite",
        "pulse-glow": "pulseGlow 2s ease-in-out infinite",
        "shimmer": "shimmer 2s linear infinite",
        "spin-slow": "spin 8s linear infinite",
        "bounce-slow": "bounce 3s infinite",
        "timeline": "timeline 20s linear infinite",
        "particles": "particles 15s linear infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeDown: {
          "0%": { opacity: "0", transform: "translateY(-20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideInLeft: {
          "0%": { opacity: "0", transform: "translateX(-30px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        slideInRight: {
          "0%": { opacity: "0", transform: "translateX(30px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-20px)" },
        },
        pulseGlow: {
          "0%, 100%": { boxShadow: "0 0 20px #00b4d833" },
          "50%": { boxShadow: "0 0 40px #00b4d866, 0 0 60px #00b4d822" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        timeline: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        particles: {
          "0%": { transform: "translateY(100vh) rotate(0deg)", opacity: "0" },
          "10%": { opacity: "1" },
          "90%": { opacity: "1" },
          "100%": { transform: "translateY(-100vh) rotate(720deg)", opacity: "0" },
        },
      },
      backdropBlur: {
        xs: "2px",
      },
    },
  },
  plugins: [],
};
export default config;
