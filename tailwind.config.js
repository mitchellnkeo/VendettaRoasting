/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        coffee: {
          light: '#6b4f3d',
          DEFAULT: '#3a2618',
          dark: '#271a10',
        },
        cream: {
          light: '#f9f5f0',
          DEFAULT: '#f0e6d9',
          dark: '#e6d7c3',
        }
      },
    },
  },
  plugins: [],
}