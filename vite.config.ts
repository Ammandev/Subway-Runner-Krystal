import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/TelegramBot/', // Set this to your repository name
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
  },
});
