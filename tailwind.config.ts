import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ["var(--font-display)", "Impact", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"]
      },
      colors: {
        abyss: "#07090d",
        ink: "#0d1118",
        chrome: "#d8e4ef",
        electric: "#38bdf8",
        cyanline: "#7dd3fc",
        danger: "#fb7185",
        profit: "#5ee88f"
      },
      boxShadow: {
        glow: "0 0 34px rgba(56, 189, 248, 0.28)",
        panel: "0 24px 80px rgba(0, 0, 0, 0.45)"
      },
      backgroundImage: {
        grid: "linear-gradient(rgba(125,211,252,.08) 1px, transparent 1px), linear-gradient(90deg, rgba(125,211,252,.08) 1px, transparent 1px)",
        scanline: "repeating-linear-gradient(0deg, rgba(255,255,255,.035) 0 1px, transparent 1px 4px)"
      },
      keyframes: {
        ticker: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" }
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-14px)" }
        },
        pulseGlow: {
          "0%, 100%": { opacity: "0.4" },
          "50%": { opacity: "0.9" }
        }
      },
      animation: {
        ticker: "ticker 28s linear infinite",
        float: "float 7s ease-in-out infinite",
        pulseGlow: "pulseGlow 3.4s ease-in-out infinite"
      }
    }
  },
  plugins: []
};

export default config;

