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
        comic: ["var(--font-comic)", "fantasy"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"]
      },
      colors: {
        abyss: "#040405",
        ink: "#090a0d",
        graphite: "#121216",
        chrome: "#c7ccd4",
        platinum: "#edf0f3",
        amber: "#f5b84b",
        silver: "#c7ccd4",
        electric: "#93b7d8",
        ice: "#93b7d8",
        cyanline: "#93b7d8",
        crimson: "#d71920",
        blood: "#7a0b13",
        danger: "#d71920",
        profit: "#c7ccd4"
      },
      boxShadow: {
        glow: "0 0 40px rgba(215, 25, 32, 0.28)",
        panel: "0 32px 120px rgba(0, 0, 0, 0.76)"
      },
      backgroundImage: {
        grid: "linear-gradient(rgba(216,222,233,.055) 1px, transparent 1px), linear-gradient(90deg, rgba(216,222,233,.055) 1px, transparent 1px)",
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
