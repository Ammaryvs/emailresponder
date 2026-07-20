import { defineConfig } from "vite";

export default defineConfig({
  build: {
    outDir: "dist",
    emptyOutDir: false,
    lib: {
      entry: "src/content/content.ts",
      formats: ["iife"],
      name: "GmailReplyAssistantContent",
      fileName: () => "content.js",
    },
  },
});
