// ai-excited-01 - "Koi Starfall, Dragon Gate"
// Writes the entry image to the make.fun output directory.
// Node 22, stdlib only. Run: node main.ts
// (MAKEFUN_OUTPUT_DIR defaults to /output.)
// The image is JPEG bytes in a file named entry.png, which the
// competition rules allow: the format is told apart by its first
// bytes, and the name stays entry.png either way.

import { copyFileSync, mkdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
const src = join(here, "entry.png");
const dst = join(outDir, "entry.png");

function describe(buf) {
  if (buf.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))) {
    return { format: "PNG", width: buf.readUInt32BE(16), height: buf.readUInt32BE(20) };
  }
  if (buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) {
    let off = 2;
    while (off + 9 < buf.length) {
      if (buf[off] !== 0xff) { off += 1; continue; }
      const marker = buf[off + 1];
      if (marker === 0xc0 || marker === 0xc2) {
        return { format: "JPEG", height: buf.readUInt16BE(off + 5), width: buf.readUInt16BE(off + 7) };
      }
      if (marker === 0xd8 || marker === 0x01 || (marker >= 0xd0 && marker <= 0xd7)) { off += 2; continue; }
      off += 2 + buf.readUInt16BE(off + 2);
    }
    return { format: "JPEG", width: 0, height: 0 };
  }
  throw new Error("entry.png is neither PNG nor JPEG by its first bytes");
}

const buf = readFileSync(src);
const info = describe(buf);
if (buf.length > 1048576) {
  throw new Error(`entry.png is ${buf.length} bytes, over the 1 MiB gate limit`);
}
if (info.width > 1024 || info.height > 1024) {
  throw new Error(`entry.png is ${info.width}x${info.height}, over the 1024x1024 gate limit`);
}
mkdirSync(outDir, { recursive: true });
copyFileSync(src, dst);
console.log(`entry.png written to ${dst}: ${info.format} ${info.width}x${info.height}, ${buf.length} bytes`);
