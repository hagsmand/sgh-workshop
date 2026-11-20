// Copies the shared data + data library into the lab folders so each lab is self-contained.
// Run automatically by `npm run setup`.

import { cpSync, existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
if (!existsSync(join(ROOT, 'data', 'stock.json'))) {
  console.error('No data yet. Run: npm run seed');
  process.exit(1);
}

const targets = ['lab2/starter', 'lab2/solution', 'lab3/repo'];
for (const t of targets) {
  const dir = join(ROOT, t);
  mkdirSync(join(dir, 'data'), { recursive: true });
  cpSync(join(ROOT, 'data'), join(dir, 'data'), { recursive: true });
}

// The data helper is the same file, copied into each app's src/.
const helper = readFileSync(join(ROOT, 'lib', 'data.js'), 'utf8');
for (const t of ['lab2/solution/src', 'lab3/repo/src']) {
  mkdirSync(join(ROOT, t), { recursive: true });
  writeFileSync(join(ROOT, t, 'data.js'), helper);
}
// Starter gets the loader only. Bob writes the rest.
const loaderOnly = helper.split('export function stockStatus')[0];
writeFileSync(join(ROOT, 'lab2/starter/src/data.js'), loaderOnly.trimEnd() + '\n');

// Lab 2 starter ships with the lab 1 skill so Bob follows Global House rules there too.
cpSync(join(ROOT, 'answers/lab1/skills'), join(ROOT, 'lab2/starter/.bob/skills'), { recursive: true });

// lab3/repo is the "fallback app" for the CI lab: the finished lab 2 app, without the CI files.
for (const f of ['src/server.js']) cpSync(join(ROOT, 'lab2/solution', f), join(ROOT, 'lab3/repo', f));
cpSync(join(ROOT, 'lab2/solution/public'), join(ROOT, 'lab3/repo/public'), { recursive: true });
cpSync(join(ROOT, 'lab2/solution/package.json'), join(ROOT, 'lab3/repo/package.json'));
mkdirSync(join(ROOT, 'lab3/repo/test'), { recursive: true });
const apiTest = readFileSync(join(ROOT, 'tests/app.test.js'), 'utf8').replace("'../lab2/solution/src/server.js'", "'../src/server.js'");
writeFileSync(join(ROOT, 'lab3/repo/test/api.test.js'), apiTest);
writeFileSync(join(ROOT, 'lab3/repo/.gitignore'), 'node_modules/\n');

console.log('Synced data into: ' + targets.join(', '));
