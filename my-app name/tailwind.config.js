/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#121417",
        foreground: "#FFFFFF",
        card: {
          DEFAULT: "#1E2126",
          foreground: "#FFFFFF",
          hover: "#252930",
        },
        popover: {
          DEFAULT: "#1E2126",
          foreground: "#FFFFFF",
        },
        primary: {
          DEFAULT: "#EAB308",
          foreground: "#121417",
          hover: "#CA8A04",
          light: "rgba(234, 179, 8, 0.12)",
        },
        secondary: {
          DEFAULT: "#2B2F36",
          foreground: "#F3F4F6",
        },
        muted: {
          DEFAULT: "#2B2F36",
          foreground: "#9CA3AF",
        },
        accent: {
          DEFAULT: "#EAB308",
          foreground: "#121417",
        },
        destructive: {
          DEFAULT: "#EF4444",
          foreground: "#FFFFFF",
        },
        border: "#2B2F36",
        input: "#2B2F36",
        ring: "#EAB308",
        royal: {
          bg: "#121417",
          card: "#1E2126",
          cardHover: "#242830",
          border: "#2B2F36",
          borderHover: "#3C424D",
          gold: "#EAB308",
          goldHover: "#CA8A04",
          goldDark: "#A16207",
          goldGlow: "rgba(234, 179, 8, 0.25)",
          text: "#FFFFFF",
          muted: "#9CA3AF",
          subtle: "#6B7280",
        }
      },
      borderRadius: {
        lg: "0.75rem",
        md: "0.5rem",
        sm: "0.375rem",
        xl: "1rem",
        "2xl": "1.25rem",
      },
      boxShadow: {
        'gold-glow': '0 0 20px -3px rgba(234, 179, 8, 0.25)',
        'card-dark': '0 4px 20px -2px rgba(0, 0, 0, 0.45)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
