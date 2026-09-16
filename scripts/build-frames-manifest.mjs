/**
 * Scans frames/ and writes frames/manifest.json — the list the
 * slideshow at frames.html reads. Run via `npm run frames:manifest`,
 * or automatically on commit (see .git/hooks/pre-commit).
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const FRAMES_DIR = path.join(__dirname, '..', 'frames');
const IMAGE_EXT = new Set(['.jpg', '.jpeg', '.png', '.webp', '.gif']);

export function buildManifest() {
  const files = fs.readdirSync(FRAMES_DIR)
    .filter(name => IMAGE_EXT.has(path.extname(name).toLowerCase()))
    .sort((a, b) => a.localeCompare(b));

  fs.writeFileSync(
    path.join(FRAMES_DIR, 'manifest.json'),
    JSON.stringify(files, null, 2) + '\n'
  );
  return files;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const files = buildManifest();
  console.log(`frames/manifest.json — ${files.length} image(s)`);
}
