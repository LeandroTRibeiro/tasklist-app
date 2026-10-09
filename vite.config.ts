import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
    plugins: [
        react(),
        // Installable app whose shell works offline; tasks live in the device's storage.
        VitePWA({
            registerType: 'autoUpdate',
            includeAssets: ['favicon.svg', 'icons/apple-touch-icon.png'],
            manifest: {
                name: 'devtasks · caderno de tarefas',
                short_name: 'devtasks',
                description: 'Lista de tarefas que funciona offline e sincroniza entre aparelhos.',
                lang: 'pt-BR',
                start_url: '/',
                scope: '/',
                display: 'standalone',
                background_color: '#fbfaf5',
                theme_color: '#fbfaf5',
                icons: [
                    { src: 'icons/icon-192.png', sizes: '192x192', type: 'image/png' },
                    { src: 'icons/icon-512.png', sizes: '512x512', type: 'image/png' },
                    { src: 'icons/maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
                ],
            },
            workbox: {
                globPatterns: ['**/*.{js,css,html,svg,png,woff2}'],
                navigateFallback: 'index.html',
            },
        }),
    ],
});
