import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/projects": "http://localhost:3001",
      "/tasks": "http://localhost:3001",
      "/api": "http://localhost:3001",
    },
  },
});
