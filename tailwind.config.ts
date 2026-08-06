import type { Config } from "tailwindcss";

// ── HN Ice Cream design tokens ──────────────────────────────────────────────
// Color: white base, soft pink + purple gradient, luxury glassmorphism
// Type:  "Fraunces" (display, luxury serif with warmth) + "Outfit" (body, geometric/clean)
const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        cream: "#FFFDFB",
        blush: {
          50: "#FFF6FA",
          100: "#FFE7F1",
          200: "#FFC9DF",
          300: "#FF9FC4",
          400: "#FF6FA6",
          500: "#F94F91",
        },
        grape: {
          50: "#F7F3FF",
          100: "#EAE0FF",
          200: "#D3BEFF",
          300: "#B490F5",
          400: "#9A63EA",
          500: "#7C3AED",
          600: "#6425C7",
          700: "#4C1D95",
        },
        ink: "#2B1B36",
      },
      fontFamily: {
        display: ["Fraunces", "Georgia", "serif"],
        body: ["Outfit", "-apple-system", "Segoe UI", "sans-serif"],
      },
      backgroundImage: {
        "grape-blush": "linear-gradient(135deg, #7C3AED 0%, #F94F91 100%)",
        "soft-glow": "radial-gradient(circle at 30% 20%, rgba(255,111,166,0.25), transparent 55%), radial-gradient(circle at 80% 80%, rgba(124,58,237,0.2), transparent 55%)",
      },
      boxShadow: {
        glass: "0 8px 32px rgba(124,58,237,0.12)",
        "glass-lg": "0 20px 60px rgba(124,58,237,0.18)",
      },
      borderRadius: {
        "4xl": "2rem",
        "5xl": "2.5rem",
      },
      animation: {
        float: "float 6s ease-in-out infinite",
        "fade-up": "fadeUp 0.7s ease-out forwards",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-14px)" },
        },
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
