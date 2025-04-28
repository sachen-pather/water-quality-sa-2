import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  define: {
    "import.meta.env.VITE_API_URL": JSON.stringify(process.env.VITE_API_URL),
    "import.meta.env.VITE_UPLOAD_API_URL": JSON.stringify(
      process.env.VITE_UPLOAD_API_URL
    ),
    "import.meta.env.VITE_OPENWEATHER_API_KEY": JSON.stringify(
      process.env.VITE_OPENWEATHER_API_KEY
    ),
    "import.meta.env.VITE_GEMINI_API_KEY": JSON.stringify(
      process.env.VITE_GEMINI_API_KEY
    ),
  },
  build: {
    outDir: "dist",
  },
  server: {
    port: 5173,
  },
  base: "/", // Ensure this matches your deployment path (e.g., "/" for root, "/subpath" for subdirectories)
});
