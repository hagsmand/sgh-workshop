// Stock Dashboard API. Starter for lab 2.
// This file only answers /api/health. You and Bob build the rest (see ../SPEC.md).

import express from 'express';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadData } from './data.js';

const here = dirname(fileURLToPath(import.meta.url));
const data = loadData(join(here, '..', 'data'));

export function createApp() {
  const app = express();
  app.get('/api/health', (_req, res) => res.json({ ok: true, asOf: data.asOf }));
  app.use(express.static(join(here, '..', 'public')));
  return app;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const port = Number(process.env.PORT ?? 3000);
  createApp().listen(port, () => console.log(`Stock dashboard on http://localhost:${port}`));
}
