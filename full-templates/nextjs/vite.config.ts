import { vanillaExtractPlugin } from '@vanilla-extract/vite-plugin';
import path from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [vanillaExtractPlugin()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
