/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Modern Heritage Palette
        ivory: "#FFFFF0",      // Warm Ivory Background
        surface: "#FFFFFF",    // Pure White Surface
        maroon: {
          DEFAULT: "#7B1818",  // Primary Action (Deep Maroon)
          hover: "#5F1212",
          light: "#FBF3F3",
        },
        navy: {
          DEFAULT: "#0B2545",  // Nav/Accents (Navy Blue)
          hover: "#133E72",
          muted: "#1B3B6F",
          subtle: "#EDF2F7",
        },
        line: "#DCD8BE",       // Warm Ivory border tone
      },
      fontFamily: {
        sans: ["Inter", "Montserrat", "system-ui", "sans-serif"],
      },
      // Enforce sharp corners across all classes
      borderRadius: {
        DEFAULT: "0px",
        none: "0px",
        sm: "0px",
        md: "0px",
        lg: "0px",
        xl: "0px",
        "2xl": "0px",
        "3xl": "0px",
        full: "0px",
      },
      // Enforce flat design (no box shadows)
      boxShadow: {
        DEFAULT: "none",
        none: "none",
        sm: "none",
        md: "none",
        lg: "none",
        xl: "none",
        "2xl": "none",
        inner: "none",
      },
    },
  },
  plugins: [],
};
