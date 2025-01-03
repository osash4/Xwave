import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { nodePolyfills } from 'vite-plugin-node-polyfills';

export default defineConfig({
  plugins: [
    react(),
    nodePolyfills({
      protocolImports: true, // Polyfill para imports 'node:'
    }),
  ],
  resolve: {
    alias: {
      process: 'process/browser', // Polyfill para process
      stream: 'stream-browserify', // Polyfill para stream
      crypto: 'crypto-browserify', // Polyfill para crypto
      path: 'path-browserify',     // Polyfill para path
      os: 'os-browserify/browser', // Polyfill para os
      util: 'util',                // Polyfill para util
      buffer: 'buffer',            // Polyfill para Buffer
    },
  },
  define: {
    global: 'globalThis', // Define 'global' como 'globalThis'
  },
  optimizeDeps: {
    include: [
      'buffer',              // Asegura que buffer se incluya
      'process',             // Asegura que process se incluya
      'stream-browserify',   // Asegura que stream-browserify se incluya
      'crypto-browserify',   // Asegura que crypto-browserify se incluya
      'path-browserify',     // Asegura que path-browserify se incluya
      'os-browserify/browser', // Asegura que os-browserify se incluya
    ],
  },
});
