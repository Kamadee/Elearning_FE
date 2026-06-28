import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import { sentryVitePlugin } from '@sentry/vite-plugin'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
    // Chỉ kích hoạt Sentry plugin khi có SENTRY_AUTH_TOKEN trong môi trường build
    process.env.SENTRY_AUTH_TOKEN && sentryVitePlugin({
      org: process.env.SENTRY_ORG || 'your-sentry-organization-slug',
      project: process.env.SENTRY_PROJECT || 'your-sentry-project-slug',
      authToken: process.env.SENTRY_AUTH_TOKEN,
    }),
  ].filter(Boolean),
  build: {
    sourcemap: true, // Tạo source maps để Sentry dịch ngược code lỗi
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    allowedHosts: [
      'marth-venerative-ferally.ngrok-free.dev'
    ],
    host: true,
    port: 5173
  }

})
