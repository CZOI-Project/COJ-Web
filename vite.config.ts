import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import VueSetupExtend from 'vite-plugin-vue-setup-extend'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue({
      template: {
          compilerOptions: {
              isCustomElement: tag => tag.startsWith('ion-'),
          },
      },
    }),
    VueSetupExtend()
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      'codemirror/mode/meta': 'codemirror/mode/meta.js',
    }
  },
  optimizeDeps: {
    include: [
      // 确保包含 CodeMirror 和相关模式
      'codemirror',
      'codemirror/mode/javascript/javascript.js',
      'codemirror/mode/clike/clike.js'
      // 添加其他你需要的模式或主题
    ],
  },
  server:{
    proxy:{
      '/api':{
        target:'http://localhost:8080',
        changeOrigin:true,
        rewrite:(path)=>path.replace(/^\/api/,'')
      },
      '/resources':{
        target:'http://localhost:8080',
        changeOrigin:true
      }
    }
  }
})
