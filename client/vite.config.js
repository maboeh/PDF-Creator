import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          "vendor-react": ["react", "react-dom"],
          "vendor-pdf": ["react-pdf", "pdfjs-dist"],
          "vendor-editor": ["@tiptap/core", "@tiptap/react", "@tiptap/starter-kit"],
          "vendor-utils": ["dompurify", "marked"],
        },
      },
    },
    chunkSizeWarningLimit: 350,
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./src/test/setup.js"],
    css: false,
    include: ["src/**/*.{test,spec}.{js,jsx}"],
    testTimeout: 10000,
    pool: "forks",
  },
})
