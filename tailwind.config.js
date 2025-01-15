/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: 'class', 
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        'light-gradient': 'linear-gradient(45deg, #000000 30%, #191919 48%, #333333 12%)',
        'dark-gradient': 'linear-gradient(45deg, #ee9ca7 60%, #ffdde1 40%)',
      },
    },
  },
  variants: {
    extend: {
      backgroundImage: ['dark'], 
    },
  },
  plugins: [],
};
