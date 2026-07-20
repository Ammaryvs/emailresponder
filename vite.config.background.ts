import { defineConfig } from "vite";

export default defineConfig({
  build: {
    outDir: "dist",
    emptyOutDir: true,
    lib: {
      entry: "src/background/background.ts",
      formats: ["es"],
      fileName: () => "background.js",
    },
  },
});
