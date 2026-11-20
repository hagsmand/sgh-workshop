// Quick health check for the workshop kit. Run: npm run check
// Prints one line per check and exits 1 if anything is wrong.

import { existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadData } from '../lib/data.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
let failed = 0;
const ok = (msg) => console.log(`  ok   ${msg}`);
const bad = (msg) => { failed++; console.log(`  FAIL ${msg}`); };

const major = Number(process.versions.node.split('.')[0]);
major >= 22 ? ok(`Node.js ${process.versions.node}`) : bad(`Node.js ${process.versions.node} is too old. Install Node.js 24 LTS from nodejs.org.`);

try {
  const d = loadData(join(ROOT, 'data'));
  d.products.length === 60 ? ok('60 products') : bad(`expected 60 products, found ${d.products.length}`);
  d.stock.length === 180 ? ok('180 stock rows (3 branches)') : bad(`expected 180 stock rows, found ${d.stock.length}`);
  d.sales.length > 10000 ? ok(`${d.sales.length} sales rows`) : bad(`only ${d.sales.length} sales rows`);
} catch (e) {
  bad(`data files: ${e.message}. Run: npm run seed`);
}

for (const f of ['lab1/mcp/inventory-server.js', 'lab2/starter/package.json', 'lab2/solution/src/server.js', 'lab3/repo/package.json', 'lab3/ci/bob-review.yml', 'lab4/monday-pack/weekly-sales.csv']) {
  existsSync(join(ROOT, f)) ? ok(f) : bad(`missing ${f}`);
}

try { await import('@modelcontextprotocol/sdk/server/mcp.js'); ok('MCP SDK installed'); } catch { bad('MCP SDK missing. Run: npm install'); }
try { await import('express'); ok('express installed'); } catch { bad('express missing. Run: npm install'); }

console.log(failed ? `\n${failed} problem(s). Fix them, then run npm run check again.` : '\nAll good. You are ready for the workshop.');
process.exit(failed ? 1 : 0);
