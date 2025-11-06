// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    hmr: {
      overlay: false,
    },
  },
  build: {
    sourcemap: false, // ✅ Desactiva sourcemaps
    minify: 'esbuild',
    rollupOptions: {
      output: {
        manualChunks: {
          // Agrupa dependencias grandes en un solo chunk
          vendor: ['react', 'react-dom', 'react-router-dom'],
          primereact: ['primereact'],
        },
      },
    },
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom', 'primereact'],
  },
});
