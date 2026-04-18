import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    tailwindcss(), // 이 한 줄이 PostCSS 설정을 대신합니다.
  ],
})