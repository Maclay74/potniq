import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  resolve: { alias: { src: resolve("src/") } },
  build: { lib: { entry: resolve(__dirname, "src/main.ts"), formats: ["es"] } },
});
