import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

import dotenv from 'dotenv';
dotenv.config();

const VITE_FOLDER_NAME = process.env.VITE_FOLDER_NAME;

// Check if the environment variable is set
if (typeof VITE_FOLDER_NAME === 'undefined' || VITE_FOLDER_NAME === '') {
  console.error(
    'VITE_FOLDER_NAME environment variable is not set, update your .env file with a value naming your dashboard, eg "VITE_FOLDER_NAME=ha-dashboard"'
  );
  process.exit(1);
}

// https://vitejs.dev/config/
export default defineConfig({
  base: `/local/${VITE_FOLDER_NAME}/`,
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 80,
    strictPort: true,
    // Allow access from homeserver.local and any other hosts
    cors: true,
    hmr: false, // Disable HMR completely
    watch: {
      usePolling: true
    },
    fs: {
      // Allow serving files from one level up to the project root
      allow: ['..']
    },
    // If you're using a secure domain, origin should be https
    origin: 'https://son.stigbosmans.be',
    // Explicitly allow homeserver.local and other hosts
    allowedHosts: [
      'homeserver.local',
      'localhost',
      '127.0.0.1',
      // Add any other domains you might access from
      '*.local',
      'son.stigbosmans.be'
    ]
  },
  preview: {
    host: '0.0.0.0',
    port: 80
  }
});
