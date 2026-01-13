
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate', // Service Workerを自動更新
      includeAssets: [
        'favicon.svg',
        'robots.txt',
        'icons/icon-192.png',
        'icons/icon-512.png'
      ],
      manifest: {
        name: '店舗調査用カウンター',
        short_name: 'ufo_counter',
        start_url: '/ufotest/',
        scope: '/ufotest/',
        display: 'standalone',
        background_color: '#ffffff',
        theme_color: '#0b6efc',
        icons: [
          { src: 'icons/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icons/icon-512.png', sizes: '512x512', type: 'image/png' }
        ]
      },
      // オフライン対応（最低限の静的ファイルキャッシュ）
      workbox: {
        globPatterns: ['**/*.{js,css,svg,png,jpg,webp}'],
        navigateFallback: '/ufotest/index.html',
        cleanupOutdatedCaches: true,
        clientsClaim: true,
        skipWaiting: true,
      },
      injectRegister: 'auto',
    })
  ],
  // ★ スマホからアクセス可能にする設定を追加
  server: {
    host: true,      // LAN内からアクセス可能
    port: 5173,      // 任意（デフォルト5173）
    strictPort: true // ポート固定（任意）
  },
  base: '/ufotest/'
});