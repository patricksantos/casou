import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
    plugins: [react()],
    assetsInclude: ['**/*.jpeg', '**/*.jpg', '**/*.png'],
    base: '/',
    server: {
        historyApiFallback: true,
    },
    build: {
        outDir: 'dist',
        assetsDir: 'assets',
        sourcemap: false,
    },
})
