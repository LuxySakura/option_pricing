import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000, 
    open: true,
    proxy: {
      // Vite 开发服务器会自动将这个请求转发到 http://localhost:8000
      '/api': {
        target: 'http://localhost:8000', // 目标后端服务地址
        changeOrigin: true, // 需要虚拟主机站点
      }
    }
  }
})