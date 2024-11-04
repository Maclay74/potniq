import isolatedDecl from "bun-plugin-isolated-decl";
await Bun.build({
  entrypoints: ["./index.ts"],
  outdir: "./",
  plugins: [isolatedDecl()],
  // ... other configuration options
});
