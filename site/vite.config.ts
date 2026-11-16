import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// Published by GitHub Pages from main:/docs at https://bzaat.github.io/bzaat/
// `npm run build` writes the site into ../docs; commit docs/ to publish.
export default defineConfig({
  base: process.env.BASE_PATH ?? "/bzaat/",
  plugins: [react(), tailwindcss()],
  build: {
    outDir: "../docs",
    emptyOutDir: true,
    // Mermaid is split into lazy chunks that only load when a project drawer opens.
    chunkSizeWarningLimit: 900,
  },
});
