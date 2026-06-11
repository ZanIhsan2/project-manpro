import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Frontend dev server. /api requests are proxied to the Express backend
// (default http://localhost:3000) so you don't run into CORS in development.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      "/api": {
        target: "http://localhost:3000",
        changeOrigin: true
      },
      "/uploads": {
        target: "http://localhost:3000",
        changeOrigin: true
      }
    }
  }
});
