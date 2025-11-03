module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        tomato: {
          50: '#fff5f5',
          600: '#ff1f1f',
        },
        cream: '#FEF6E4',
      },
    },
  },
  plugins: [],
}