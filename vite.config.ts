import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  // Relativ base gjør at appen virker både på GitHub Pages og andre steder.
  base: './',
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'apple-touch-icon.png'],
      manifest: {
        name: 'Elektrikerstudie',
        short_name: 'Elektriker',
        description: 'Øv til fagbrev som elektriker: flashcards, quiz og regneøving.',
        lang: 'nb',
        start_url: '.',
        scope: '.',
        display: 'standalone',
        background_color: '#16181d',
        theme_color: '#16181d',
        icons: [
          { src: 'icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icon-512.png', sizes: '512x512', type: 'image/png' },
          { src: 'icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
    }),
  ],
})
