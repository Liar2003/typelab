/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'type-bg': '#0a0a0f',
        'type-panel': '#12121a',
        'type-border': '#1e1e2e',
        'type-text': '#c0c0d0',
        'type-dim': '#4a4a5a',
        'type-accent': '#7c3aed',
        'type-success': '#22c55e',
        'type-error': '#ef4444',
        'type-warning': '#f59e0b',
      },
      fontFamily: {
        mono: ['"JetBrains Mono"', 'Fira Code', 'monospace'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 5px rgba(124, 58, 237, 0.5)' },
          '100%': { boxShadow: '0 0 20px rgba(124, 58, 237, 0.8)' },
        },
      },
    },
  },
  plugins: [],
}
