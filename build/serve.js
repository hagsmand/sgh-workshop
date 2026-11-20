// Tiny static file server for the workshop site (plain Node, no dependencies).
//   node build/serve.js            -> http://localhost:4173
// The pages also work by double-clicking site/index.html; use this when you want to share on a LAN.

import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { dirname, extname, join, normalize, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', 'site');
const PORT = Number(process.env.PORT ?? 4173);
const TYPES = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.ttf': 'font/ttf', '.woff2': 'font/woff2', '.zip': 'application/zip', '.svg': 'image/svg+xml', '.png': 'image/png' };

createServer(async (req, res) => {
  try {
    let path = decodeURIComponent(new URL(req.url, 'http://x').pathname);
    if (path.endsWith('/')) path += 'index.html';
    const file = normalize(join(ROOT, path));
    if (file !== ROOT && !file.startsWith(ROOT + sep)) { res.writeHead(403).end('Forbidden'); return; }
    if (!(await stat(file)).isFile()) throw new Error('not a file');
    res.writeHead(200, { 'Content-Type': TYPES[extname(file)] ?? 'application/octet-stream' });
    res.end(await readFile(file));
  } catch {
    res.writeHead(404, { 'Content-Type': 'text/plain' }).end('Not found');
  }
}).listen(PORT, () => console.log(`Workshop site on http://localhost:${PORT}`));
