import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';
export default defineConfig({
  root: 'webapp', base: '/app/', publicDir: '../web-public', plugins: [react()],
  resolve: { alias: [{ find: /^(\.\/hooks\/useBible|\.\.\/hooks\/useBible)(\.js)?$/, replacement: path.resolve('src/web/useBible.js') }] },
  build: { outDir: '../web-dist/app', emptyOutDir: true },
});
