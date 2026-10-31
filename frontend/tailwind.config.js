// tailwind.config.js
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#ecfdf5",
          500: "#10b981", // Primary Emerald accent (matches your UI storage/active states)
          600: "#059669",
          dark: "#111827", // Dark buttons/cards (matches your "Create" button)
        },
      },
    },
  },
  plugins: [],
};
