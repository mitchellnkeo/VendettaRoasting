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
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(58, 38, 24, 0.08), 0 10px 20px -2px rgba(58, 38, 24, 0.04)',
        'soft-lg': '0 10px 30px -5px rgba(58, 38, 24, 0.12), 0 15px 25px -5px rgba(58, 38, 24, 0.06)',
        'warm': '0 4px 20px rgba(58, 38, 24, 0.1)',
        'warm-lg': '0 10px 40px rgba(58, 38, 24, 0.15)',
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
      },
      transitionDuration: {
        '400': '400ms',
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      },
    },
  },
  plugins: [],
}