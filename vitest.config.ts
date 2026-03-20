import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["scripts/__tests__/**/*.test.ts"],
    coverage: {
      provider: 'v8',
      include: ['scripts/**/*.ts'],
      exclude: ['scripts/__tests__/**'],
      reporter: ['text', 'lcov'],
      thresholds: { lines: 60, functions: 60, branches: 50 },
    },
  },
});
