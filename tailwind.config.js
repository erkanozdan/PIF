/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'nova-purple': '#8b5cf6',
        'nova-blue': '#3b82f6',
        'nova-dark': '#1a1a2e',
        'nova-darker': '#16161e',
      }
    },
  },
  plugins: [],
}
