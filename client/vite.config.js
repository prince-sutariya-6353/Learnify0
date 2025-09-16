import { defineConfig } from "vite"; 
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [
    react(),        // React support
    tailwindcss(),  // TailwindCSS support
  ],
  build: {
    outDir: "dist", // Vercel expects static output in "dist"
  },
  server: {
    headers: {
      "Cross-Origin-Opener-Policy": "same-origin-allow-popups", // ✅ allow Google login popups
      "Cross-Origin-Embedder-Policy": "unsafe-none",            // ✅ disable strict COEP
    },
  },
});
