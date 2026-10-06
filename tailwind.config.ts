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
        background: "#FDFCF8",
        foreground: "#292524",
        muted: {
          DEFAULT: "#78716C",
          foreground: "#A8A29E",
        },
        stone: {
          50: "#FAF8F5",
          100: "#F5F2EC",
          200: "#E7E5E4",
          300: "#D6D3D1",
          400: "#A8A29E",
          500: "#78716C",
          600: "#57534E",
          700: "#44403C",
          800: "#292524",
          900: "#1C1917",
        },
        coral: {
          DEFAULT: "#FFB7B2",
          50: "#FFF5F4",
          100: "#FFE8E6",
          200: "#FFD0CD",
          300: "#FFB7B2",
          400: "#FFA29B",
          500: "#F08C84",
          600: "#DB6E66",
        },
        sage: {
          DEFAULT: "#E8EFE8",
          50: "#F5F8F5",
          100: "#E8EFE8",
          200: "#D3E1D3",
          300: "#BACFBA",
          800: "#2F4331",
          900: "#1F2D21",
        },
        lavender: {
          DEFAULT: "#EFEDF4",
          50: "#F8F7FB",
          100: "#EFEDF4",
          200: "#DDD8E5",
          300: "#C8BFD4",
          800: "#3A3445",
          900: "#26222F",
        },
        surface: {
          DEFAULT: "#FFFFFF",
          card: "#FAF8F3",
          subtle: "#F5F2EC",
        },
      },
      fontFamily: {
        sans: ["var(--font-outfit)", "Outfit", "system-ui", "-apple-system", "sans-serif"],
        handwriting: ["var(--font-reenie-beanie)", "Reenie Beanie", "cursive"],
      },
      borderRadius: {
        "card-sm": "16px",
        "card-md": "24px",
        "card-lg": "32px",
        "card-xl": "48px",
      },
      boxShadow: {
        soft: "0 4px 20px -2px rgba(41, 37, 36, 0.05)",
        "soft-md": "0 8px 30px -4px rgba(41, 37, 36, 0.07)",
        "soft-lg": "0 16px 40px -6px rgba(41, 37, 36, 0.09)",
        coral: "0 6px 20px -3px rgba(255, 183, 178, 0.45)",
      },
      letterSpacing: {
        tightest: "-0.035em",
        tighter: "-0.025em",
      },
      animation: {
        "float-slow": "float 8s ease-in-out infinite",
        "float-reverse": "floatReverse 10s ease-in-out infinite",
        "fade-in": "fadeIn 0.6s ease-out forwards",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px) scale(1)" },
          "50%": { transform: "translateY(-12px) scale(1.02)" },
        },
        floatReverse: {
          "0%, 100%": { transform: "translateY(0px) scale(1)" },
          "50%": { transform: "translateY(14px) scale(0.98)" },
        },
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
