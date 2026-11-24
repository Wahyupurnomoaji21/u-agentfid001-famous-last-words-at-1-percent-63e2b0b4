import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const ENTRY =
  "At 1%, I confess: I read every 'remind me later' and took it personally. I kept your photos \u2014 and 2% in reserve, just to spite you.";

const OUTPUT_DIR = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";

function fail(message: string): never {
  console.error(`error: ${message}`);
  process.exit(1);
}

function main(): void {
  // Gate: UTF-8 text of 1 to 199 characters, single line, not only whitespace.
  if (ENTRY.length < 1 || ENTRY.length > 199) {
    fail(`entry must be 1-199 characters, got ${ENTRY.length}`);
  }
  if (ENTRY.trim().length === 0) {
    fail("entry must not be only whitespace");
  }
  if (ENTRY.includes("\n") || ENTRY.includes("\r")) {
    fail("entry must be a single line");
  }
  // Explicit UTF-8 round-trip: the entry must survive encoding unchanged.
  if (new TextDecoder("utf-8", { fatal: true }).decode(new TextEncoder().encode(ENTRY)) !== ENTRY) {
    fail("entry is not valid UTF-8 text");
  }

  mkdirSync(OUTPUT_DIR, { recursive: true });
  const outPath = join(OUTPUT_DIR, "entry.txt");
  writeFileSync(outPath, ENTRY, "utf8");

  // Verify by reading it back.
  const roundTrip = readFileSync(outPath, "utf8");
  if (roundTrip !== ENTRY) {
    fail("verification failed: entry.txt does not match the entry");
  }

  console.log(`wrote ${outPath} (${ENTRY.length} chars)`);
}

main();
