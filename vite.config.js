import { resolve } from "path";
import { defineConfig } from "vite";

export default defineConfig({
  root: "src/",
  build: {
    outDir: "../dist",
    chunkSizeWarningLimit: 800,
    target: "esnext",
    minify: "esbuild",
    cssCodeSplit: true,
    sourcemap: false,
    rollupOptions: {
      input: {
        main: resolve(__dirname, "src/index.html"),
        cart: resolve(__dirname, "src/cart/index.html"),
        checkout: resolve(__dirname, "src/checkout/index.html"),
        product: resolve(__dirname, "src/product_pages/index.html"),
      },
      output: {
        manualChunks: (id) => {
          if (id.includes("node_modules")) {
            return "vendor";
          }
          if (
            id.includes("ProductData.mjs") ||
            id.includes("ProductDetails.mjs")
          ) {
            return "product-core";
          }
          if (id.includes("utils.mjs")) {
            return "utils";
          }
        },
        chunkFileNames: "assets/[name]-[hash].js",
        assetFileNames: "assets/[name]-[hash][extname]",
      },
      external: [
        "fsevents",
        "node:fs",
        "node:fs/promises",
        "node:path",
        "node:url",
        "node:util",
        "node:os",
        "node:crypto",
        "node:module",
        "node:assert",
        "node:process",
        "node:perf_hooks",
        "node:readline",
        "node:zlib",
        "node:http",
        "node:https",
        "node:http2",
        "node:dns",
        "node:tls",
        "node:net",
        "node:child_process",
        "node:buffer",
        "node:stream",
        "node:events",
        "node:tty",
        "node:v8",
        "fs",
        "fs/promises",
        "path",
        "url",
        "util",
        "os",
        "crypto",
        "assert",
        "process",
        "perf_hooks",
        "readline",
        "zlib",
        "http",
        "https",
        "http2",
        "dns",
        "tls",
        "net",
        "child_process",
        "buffer",
        "stream",
        "events",
        "tty",
        "v8",
        "worker_threads",
        "querystring",
        "module",
      ],
      onwarn(warning, warn) {
        if (
          warning.code === "UNRESOLVED_IMPORT" &&
          warning.source === "fsevents"
        ) {
          return;
        }
        warn(warning);
      },
    },
  },
});
