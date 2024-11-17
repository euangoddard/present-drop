import { defineConfig } from "vite";

export default defineConfig({
  logLevel: "info",
  build: {
    rollupOptions: {
      input: {
        main: "index.html",
        play: "play.html",
      },
      output: {
        manualChunks: {
          phaser: ["phaser"],
        },
      },
    },
    minify: "terser",
    terserOptions: {
      compress: {
        passes: 2,
      },
      mangle: true,
      format: {
        comments: false,
      },
    },
  },
});
