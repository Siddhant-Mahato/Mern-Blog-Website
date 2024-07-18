const flowbite = require("flowbite-react/tailwind");
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}", flowbite.content(), "./index.html"],
  theme: {
    extend: {},
  },
  plugins: [
    require("flowbite/plugin"),
    require("tailwind-scrollbar"),
  ],
};
