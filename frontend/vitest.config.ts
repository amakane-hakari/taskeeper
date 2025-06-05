/// <reference types="vitest" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import { vanillaExtractPlugin } from '@vanilla-extract/vite-plugin';

export default defineConfig({
  plugins: [react(), vanillaExtractPlugin()],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
  test: {
    globals: true,
    environment: 'happy-dom',
    setupFiles: ['./vitest.setup.ts'],
    include: ['src/**/*.{test,spec}.{ts,tsx}'],
    // CI環境での問題を解決するための設定
    pool: 'forks',
    poolOptions: {
      forks: {
        singleFork: true,
      },
    },
    // タイムアウト設定
    testTimeout: 10000,
    hookTimeout: 10000,
    teardownTimeout: 10000,
    // プロセス終了の問題を解決
    restoreMocks: true,
    clearMocks: true,
    resetMocks: true,
    // hanging-process レポーターを追加（デバッグ用）
    reporters: process.env.CI ? ['verbose', 'hanging-process'] : ['verbose'],
  },
});
