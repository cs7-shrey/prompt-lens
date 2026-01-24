import { defineConfig } from "tsdown";

export default defineConfig({
  entry: "./src/index.ts",
  format: "esm",
  outDir: "./dist",
  clean: true,
  noExternal: [/@prompt-lens\/.*/],
  external: ["ws"], // Native module that must not be bundled
});
