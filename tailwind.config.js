/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        surface: '#0b0e14',
        panel: '#12161f',
        neon: {
          green: '#39ff88',
          pink: '#ff3d81',
          cyan: '#00e5ff',
        },
      },
      boxShadow: {
        'glow-green': '0 0 12px rgba(57,255,136,0.45)',
        'glow-pink': '0 0 12px rgba(255,61,129,0.45)',
        'glow-cyan': '0 0 12px rgba(0,229,255,0.45)',
      },
    },
  },
  plugins: [],
}
