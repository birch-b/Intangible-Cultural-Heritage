// 基于vite的配置
import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

export default defineConfig(({ mode }) => {
  return {
    base: mode === 'production' ? '/gric/' : '/',
    plugins: [vue(), vueDevTools()],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      }
    },
    server: {
      host: '0.0.0.0',
      port: 5174,
      proxy: {
        '/api': {
          target: 'http://118.195.215.81',
          changeOrigin: true,
          secure: false,
          rewrite: (path) => path.replace(/^\/api/, '/gric/api')
        },
        '/uploads': {
          target: 'http://118.195.215.81',
          changeOrigin: true,
          secure: false,
          rewrite: (path) => path.replace(/^\/uploads/, '/gric/uploads')
        },
        '/gric/uploads': {
          target: 'http://118.195.215.81',
          changeOrigin: true,
          secure: false
        }
      }
    }
  }
})
