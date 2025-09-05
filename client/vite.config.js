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
});
