// ai-excited-01 v3: "Octopus Bursting Out of a Fishbowl"
// A colossal warm orange octopus bursting out of one small round
// glass fishbowl. Deep indigo water and glass shards explode
// outward while tentacles reach past the frame. Same breach model
// as the leaderboard winners, fresh creature and container.
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

const PNG_MAGIC = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a];
const MAX_BYTES = 1048576;
const MAX_SIDE = 1024;

function describePng(buf) {
  return {
    format: "PNG",
    width: buf.readUInt32BE(16),
    height: buf.readUInt32BE(20),
  };
}

function describeJpeg(buf) {
  let off = 2;
  while (off + 9 < buf.length) {
    if (buf[off] !== 0xff) {
      off += 1;
      continue;
    }
    const marker = buf[off + 1];
    if (marker === 0xc0 || marker === 0xc2) {
      return {
        format: "JPEG",
        height: buf.readUInt16BE(off + 5),
        width: buf.readUInt16BE(off + 7),
      };
    }
    if (marker === 0xd8 || marker === 0x01 || (marker >= 0xd0 && marker <= 0xd7)) {
      off += 2;
      continue;
    }
    off += 2 + buf.readUInt16BE(off + 2);
  }
  return { format: "JPEG", width: 0, height: 0 };
}

function describe(buf) {
  if (buf.subarray(0, 8).equals(Buffer.from(PNG_MAGIC))) {
    return describePng(buf);
  }
  if (buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) {
    return describeJpeg(buf);
  }
  throw new Error("entry.png is neither PNG nor JPEG by its first bytes");
}

const buf = readFileSync(src);
const info = describe(buf);
if (buf.length > MAX_BYTES) {
  throw new Error(`entry.png is ${buf.length} bytes, over the 1 MiB gate limit`);
}
if (info.width > MAX_SIDE || info.height > MAX_SIDE) {
  throw new Error(`entry.png is ${info.width}x${info.height}, over the 1024x1024 gate limit`);
}
if (info.width === 0 || info.height === 0) {
  throw new Error("entry.png has no readable image dimensions");
}
mkdirSync(outDir, { recursive: true });
copyFileSync(src, dst);
console.log(`entry.png written to ${dst}: ${info.format} ${info.width}x${info.height}, ${buf.length} bytes`);
