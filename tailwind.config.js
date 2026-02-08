
module.exports = {
  darkMode: "selector",
  content: [
  './index.html',
  './src/**/*.{js,ts,jsx,tsx}'
],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        
        // ZMade Brand Colors
        zm: {
          greyOlive: "#7B928D",
          stoneBrown: "#5B554B",
          white: "#FBFEFF",
          mintCream: "#F0FFFA",
          deepTeal: "#667D77",
          deepTealHover: "#556A64", // Slightly darker for hover
        },

        primary: {
          DEFAULT: "#667D77", // zm-deepTeal
          foreground: "#FBFEFF", // zm-white
        },
        secondary: {
          DEFAULT: "#F0FFFA", // zm-mintCream
          foreground: "#5B554B", // zm-stoneBrown
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "#F0FFFA", // zm-mintCream
          foreground: "#7B928D", // zm-greyOlive
        },
        accent: {
          DEFAULT: "#F0FFFA", // zm-mintCream
          foreground: "#5B554B", // zm-stoneBrown
        },
        popover: {
          DEFAULT: "#FBFEFF", // zm-white
          foreground: "#5B554B", // zm-stoneBrown
        },
        card: {
          DEFAULT: "#FBFEFF", // zm-white
          foreground: "#5B554B", // zm-stoneBrown
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        xl: "12px",
      },
      fontFamily: {
        heading: ["Playball", "cursive"],
        body: ["Poppins", "sans-serif"],
        sans: ["Poppins", "sans-serif"],
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(91, 85, 75, 0.1)',
        'card': '0 2px 10px -1px rgba(91, 85, 75, 0.05)',
      }
    },
  },
  plugins: [],
}
