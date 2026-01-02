import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
  },
  define: {
    // This allows the code `process.env.API_KEY` to work in the browser
    // by replacing it with `import.meta.env.VITE_API_KEY` at build time.
    'process.env.API_KEY': 'import.meta.env.VITE_API_KEY',
  }
});