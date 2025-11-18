import tailwindcss from '@tailwindcss/vite';
import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react'
import * as path from "node:path";
import { VitePWA } from 'vite-plugin-pwa';

// https://vite.dev/config/
export default defineConfig({
    plugins: [react(),
        tailwindcss(),
        VitePWA({
            registerType: 'autoUpdate', // 서비스 워커 자동 업데이트 설정
            injectRegister: 'auto',     // 서비스 워커 등록 코드를 자동으로 주입
            // (1) 매니페스트 설정
            manifest: {
                name: 'D:ASH',
                short_name: 'D:ASH',
                description: '소상공인 쿠폰 발급 서비스',
                theme_color: '#ffffff',
                background_color: '#ffffff',
                icons: [
                    {
                        src: 'web-app-manifest-192x192',
                        sizes: '192x192',
                        type: 'image/png'
                    },
                    {
                        src: 'web-app-manifest-512x512.png',
                        sizes: '512x512',
                        type: 'image/png'
                    },
                ]
            },
            // (2) 캐싱 설정 (서비스 워커)
            workbox: {
                globPatterns: ['**/*.{js,css,html,ico,png,svg,webp}'],
                // 원하는 캐싱 전략에 따라 추가 설정 가능
            },
            // (3) 스플래시 화면용 메타 태그 주입
            includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'site.webmanifest'],
        })
    ],
    resolve: {
        alias: {
            "@features": path.resolve(__dirname, "src/features"),
            "@shared": path.resolve(__dirname, "src/shared"),
            "@app": path.resolve(__dirname, "src/app"),
            "@entities": path.resolve(__dirname, "src/entities"),
        },
    },
})
