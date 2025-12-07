import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import { VitePWA } from 'vite-plugin-pwa';
import path from 'path';

export default defineConfig({
    plugins: [
        react(),
        VitePWA({
            registerType: 'autoUpdate',
            includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg'],
            manifest: {
                name: 'SkyWeather',
                short_name: 'SkyWeather',
                description: 'Modern weather application with real-time forecasts',
                theme_color: '#0f172a',
                background_color: '#0f172a',
                display: 'standalone',
                icons: [
                    {
                        src: 'pwa-192x192.png',
                        sizes: '192x192',
                        type: 'image/png'
                    },
                    {
                        src: 'pwa-512x512.png',
                        sizes: '512x512',
                        type: 'image/png'
                    }
                ]
            },
            workbox: {
                globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
                runtimeCaching: [
                    {
                        urlPattern: /^https:\/\/pro\.openweathermap\.org\/.*/i,
                        handler: 'NetworkFirst',
                        options: {
                            cacheName: 'weather-api-cache',
                            expiration: {
                                maxEntries: 50,
                                maxAgeSeconds: 60 * 5
                            },
                            cacheableResponse: {
                                statuses: [0, 200]
                            }
                        }
                    },
                    {
                        urlPattern: /^https:\/\/api\.open-meteo\.com\/.*/i,
                        handler: 'NetworkFirst',
                        options: {
                            cacheName: 'uv-api-cache',
                            expiration: {
                                maxEntries: 20,
                                maxAgeSeconds: 60 * 30
                            }
                        }
                    }
                ]
            }
        })
    ],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
            '@components': path.resolve(__dirname, './src/components'),
            '@hooks': path.resolve(__dirname, './src/hooks'),
            '@utils': path.resolve(__dirname, './src/utils'),
            '@store': path.resolve(__dirname, './src/store'),
            '@services': path.resolve(__dirname, './src/services'),
            '@types': path.resolve(__dirname, './src/types'),
            '@i18n': path.resolve(__dirname, './src/i18n'),
            '@assets': path.resolve(__dirname, './src/assets')
        }
    },
    base: '/'
});
