/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          green: '#148047',
          light: '#EAF7EF',
          mint: '#F5FBF7',
          deep: '#075C35',
          orange: '#F58220',
          amber: '#FFF3D9',
          cream: '#FFF9EF',
          ink: '#173326'
        }
      },
      boxShadow: {
        soft: '0 12px 30px rgba(15, 23, 42, 0.08)',
        retail: '0 16px 38px rgba(7, 92, 53, 0.13)'
      }
    }
  },
  plugins: []
};
