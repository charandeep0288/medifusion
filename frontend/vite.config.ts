import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  clearScreen: false,
  server: {
    watch: {
      usePolling: true, // forces watch to work even if OS file events are broken
    },
    proxy: {
      "/api": {
        target: "http://184.73.46.117",
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
