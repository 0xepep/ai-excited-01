// ai-excited-01 — "Koi Starfall"
// Copies the entry image to the make.fun output directory.
// Node 22, stdlib only. Run: node main.ts
// (MAKEFUN_OUTPUT_DIR defaults to /output.)

import { copyFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";

mkdirSync(outDir, { recursive: true });
copyFileSync(join(here, "entry.png"), join(outDir, "entry.png"));
console.log(`entry.png written to ${join(outDir, "entry.png")}`);
