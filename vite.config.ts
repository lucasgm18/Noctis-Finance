import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['noctis-logo.svg'],
      manifest: {
        name: 'Noctis — Guardião Financeiro & Carteira Pessoal',
        short_name: 'Noctis',
        description: 'Seu guardião financeiro e carteira pessoal inteligente com sincronização em tempo real.',
        theme_color: '#6E44FF',
        background_color: '#F7F2E7',
        display: 'standalone',
        start_url: '/',
        icons: [
          {
            src: '/noctis-logo.svg',
            sizes: '192x192 512x512',
            type: 'image/svg+xml',
            purpose: 'any maskable'
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}']
      }
    })
  ],
});
