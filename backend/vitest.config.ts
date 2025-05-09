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
    }
  },
});
