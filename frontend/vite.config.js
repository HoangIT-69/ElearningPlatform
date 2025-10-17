import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [react()],
    server: {
      proxy: {
        // Proxy tất cả các request có tiền tố '/api'
        '/api': {
          // Lấy URL backend từ file .env
          target: env.VITE_API_BASE_URL,
          changeOrigin: true,
        },
      },
    },
  }
})