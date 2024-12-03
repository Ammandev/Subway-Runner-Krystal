import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/Subway-Runner-Krystal/', // Set this to your repository name
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
  },
  server: {
    host: '0.0.0.0', // Ensures the server binds to all network interfaces
    port: parseInt(process.env.PORT || '4173', 10), // Use the PORT environment variable if available
  },
});
