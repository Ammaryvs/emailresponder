import { defineConfig } from "vite";

export default defineConfig({
  build: {
    outDir: "dist",
    emptyOutDir: false,
    lib: {
      entry: "src/options/options.ts",
      formats: ["iife"],
      name: "GmailReplyAssistantOptions",
      fileName: () => "options.js",
    },
  },
});
