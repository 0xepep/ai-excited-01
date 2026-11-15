// ai-excited-01 entry (Node 22, standard library only): the image beside this
// file is copied to /output/entry.png. The gate takes a whole PNG or JPEG of
// at most 1 MiB and 1024 by 1024 pixels; this one is a JPEG, 1024x683.
// A plain copy is deterministic, so both grader runs write identical bytes.
//
// Outside the grader's container, MAKEFUN_OUTPUT_DIR stands in for /output:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { copyFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';
mkdirSync(outDir, { recursive: true });
copyFileSync(new URL('./entry.png', import.meta.url), join(outDir, 'entry.png'));
