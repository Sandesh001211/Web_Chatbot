/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'chat-dark': '#343541',
        'chat-darker': '#202123',
        'chat-bot': '#444654',
      }
    },
  },
  plugins: [],
}
