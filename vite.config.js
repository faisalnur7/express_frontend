import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import ReactComplier from "babel-plugin-react-compiler";
import fs from 'fs';
import path from 'path';

// https://vite.dev/config/
export default defineConfig({
  server: {
    https: {
      key: fs.readFileSync(path.resolve(__dirname, 'certs/localhost-key.pem')), // Your SSL key
      cert: fs.readFileSync(path.resolve(__dirname, 'certs/localhost-cert.pem')), // Your SSL certificate
    },
    host: '0.0.0.0', // Allow external access
    port: 5173
  },
  plugins: [
    react({
      babel: {
        plugins: [ReactComplier],
      },
    }),
  ],
});
