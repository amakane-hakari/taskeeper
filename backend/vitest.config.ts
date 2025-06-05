import path from 'path';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['src/**/*.{test,spec}.{js,ts}'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      include: ['src/**/*.ts'],
      exclude: [
        'src/**/*.{test,spec}.ts',
        'src/test/**/*',
        'src/infrastructure/db/schema.ts',
      ],
    },
    environment: 'node',
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
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
    // hanging-process レポーターを追加（デバッグ用）
    reporters: process.env.CI ? ['verbose', 'hanging-process'] : ['verbose'],
  },
});
