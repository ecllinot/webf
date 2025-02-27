import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    host: "127.0.0.1",
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        secure: false,
        ws: true, // 支持 websocket
        rewrite: (path) => path // 这里修正语法错误
      }
    },
    hmr: {
      overlay: true,
      clientPort: 5173
    }
  }
});