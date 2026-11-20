// Builds the workshop site into /site and packs the code kit.
//   node build/build.js
// Needs the kit data first:  (cd kit && npm install && npm run setup)

import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { computeFacts } from './facts.js';
import { layout } from './layout.js';
import home from './pages/home.js';
import step0 from './pages/step0.js';
import lab1 from './pages/lab1.js';
import lab2 from './pages/lab2.js';
import lab3 from './pages/lab3.js';
import lab4 from './pages/lab4.js';
import facilitator from './pages/facilitator.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const SITE = join(ROOT, 'site');
const KIT = join(ROOT, 'kit');

if (!existsSync(join(KIT, 'data', 'stock.json'))) {
  console.error('Kit data is missing. Run:  cd kit && npm install && npm run setup');
  process.exit(1);
}

const F = computeFacts();
const pages = [
  ['index.html', home(F)],
  ['step-0.html', step0(F)],
  ['lab-1.html', lab1(F)],
  ['lab-2.html', lab2(F)],
  ['lab-3.html', lab3(F)],
  ['lab-4.html', lab4(F)],
  ['facilitator.html', facilitator(F)],
];
mkdirSync(SITE, { recursive: true });
for (const [name, page] of pages) writeFileSync(join(SITE, name), layout(page));
console.log(`Wrote ${pages.length} pages to site/`);

// ---- code kit zip: source only, no node_modules, no generated data (setup makes it).
const OUT = join(SITE, 'downloads');
mkdirSync(OUT, { recursive: true });
const zipPath = join(OUT, 'ghh-bob-workshop-kit.zip');
rmSync(zipPath, { force: true });
const exclude = [
  'node_modules/*', '*/node_modules/*', '.bob/*',
  'data/*', 'lab2/starter/data/*', 'lab2/solution/data/*', 'lab3/repo/data/*',
  'lab2/starter/src/data.js', 'lab2/solution/src/data.js', 'lab3/repo/src/data.js',
  'lab2/starter/.bob/*', 'lab3/repo/src/server.js', 'lab3/repo/public/*', 'lab3/repo/test/*', 'lab3/repo/package.json', 'lab3/repo/.gitignore',
  'lab4/monday-pack/*', 'reports/*', '*.DS_Store', '*/package-lock.json',
];
execFileSync('zip', ['-rq', zipPath, '.', '-x', ...exclude], { cwd: KIT });
// zip root folder name: wrap in a folder so unzip makes one directory
const tmp = join(ROOT, 'build', '.zipwrap');
rmSync(tmp, { recursive: true, force: true });
mkdirSync(join(tmp, 'ghh-bob-workshop-kit'), { recursive: true });
execFileSync('unzip', ['-q', zipPath, '-d', join(tmp, 'ghh-bob-workshop-kit')]);
rmSync(zipPath);
execFileSync('zip', ['-rq', zipPath, 'ghh-bob-workshop-kit'], { cwd: tmp });
rmSync(tmp, { recursive: true, force: true });
console.log('Packed site/downloads/ghh-bob-workshop-kit.zip');

// ---- sanity: every internal link and asset resolves; copy buttons have a source
let bad = 0;
for (const [name] of pages) {
  const html = readFileSync(join(SITE, name), 'utf8');
  const ids = new Set([...html.matchAll(/ id="([^"]+)"/g)].map((m) => m[1]));
  for (const m of html.matchAll(/(?:href|src)="([^"#:]+?)(?:#([^"]*))?"/g)) {
    const [, target, frag] = m;
    if (!target || target.startsWith('http') || target.startsWith('mailto')) continue;
    if (!existsSync(join(SITE, target))) { console.error(`BROKEN in ${name}: ${target}`); bad++; }
  }
  for (const m of html.matchAll(/href="#([^"]+)"/g)) if (!ids.has(m[1])) { console.error(`BROKEN anchor in ${name}: #${m[1]}`); bad++; }
  if (/undefined|\[object Object\]|NaN/.test(html.replace(/<pre[\s\S]*?<\/pre>/g, ''))) { console.error(`SUSPECT text in ${name}: undefined/NaN/[object Object]`); bad++; }
}
if (bad) { console.error(`${bad} problem(s)`); process.exit(1); }
console.log('Links and text checks passed');
