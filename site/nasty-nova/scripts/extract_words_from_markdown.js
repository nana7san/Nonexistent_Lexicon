#!/usr/bin/env node
/**
 * Extracts per-word Markdown (with frontmatter) from the workspace file
 * "初期コンテンツ:10語.md". Each entry is fenced in ```md blocks.
 * Writes files to src/content/words/{id}.md inside the Astro project.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const cwd = path.resolve(process.cwd());
const candidates = [
  path.join(cwd, '初期コンテンツ:10語.md'),
  path.join(cwd, '..', '初期コンテンツ:10語.md'),
  path.join(cwd, '..', '..', '初期コンテンツ:10語.md'),
  path.join(cwd, '..', '..', '..', '初期コンテンツ:10語.md'),
];
const sourcePath = candidates.find((p) => fs.existsSync(p));
// Destination inside the Astro project (sibling of scripts)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');
const destDir = path.join(projectRoot, 'src/content/words');

function main() {
  if (!fs.existsSync(sourcePath)) {
    console.error(`Source not found: ${sourcePath}`);
    process.exit(1);
  }
  const text = fs.readFileSync(sourcePath, 'utf8');
  const blocks = [];
  const fence = '```md';
  let idx = 0;
  while (true) {
    const start = text.indexOf(fence, idx);
    if (start === -1) break;
    const afterStart = start + fence.length;
    const end = text.indexOf('```', afterStart);
    if (end === -1) break;
    const content = text.slice(afterStart, end).trimStart();
    blocks.push(content);
    idx = end + 3;
  }
  if (blocks.length === 0) {
    console.error('No ```md blocks found.');
    process.exit(2);
  }
  fs.mkdirSync(destDir, { recursive: true });
  let written = 0;
  for (const b of blocks) {
    // Extract id from frontmatter
    const idMatch = b.match(/\n?---[\s\S]*?\bid:\s*"([^"]+)"[\s\S]*?---/);
    if (!idMatch) {
      console.warn('Skipped block: id not found in frontmatter');
      continue;
    }
    const id = idMatch[1];
    const filePath = path.join(destDir, `${id}.md`);
    fs.writeFileSync(filePath, b.trim() + '\n');
    written++;
  }
  console.log(`Extracted ${written} entries to ${destDir}`);
}

main();
