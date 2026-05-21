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
        abyss: "#030405",
        ink: "#0b0d10",
        graphite: "#111318",
        chrome: "#d8dee9",
        silver: "#d8dee9",
        electric: "#9be7ff",
        ice: "#9be7ff",
        cyanline: "#9be7ff",
        crimson: "#ef233c",
        danger: "#ef233c",
        profit: "#d8dee9"
      },
      boxShadow: {
        glow: "0 0 40px rgba(239, 35, 60, 0.32)",
        panel: "0 32px 120px rgba(0, 0, 0, 0.68)"
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
