// Prints (or writes) the MCP config for Bob with the correct absolute path for THIS laptop.
//
//   npm run mcp:config                 print JSON to the terminal
//   npm run mcp:config -- --write      write .bob/mcp.json in the kit folder

import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const serverPath = join(ROOT, 'lab1', 'mcp', 'inventory-server.js');

const config = {
  mcpServers: {
    'ghh-inventory': {
      command: process.execPath, // absolute path: desktop apps often do not see your shell PATH
      args: [serverPath],
      alwaysAllow: ['get_low_stock', 'get_product', 'get_sales_summary', 'suggest_reorder'],
      disabled: false,
    },
  },
};

const json = JSON.stringify(config, null, 2) + '\n';
if (process.argv.includes('--write')) {
  const target = join(ROOT, '.bob', 'mcp.json');
  mkdirSync(dirname(target), { recursive: true });
  writeFileSync(target, json);
  console.log(`Wrote ${target}`);
} else {
  process.stdout.write(json);
}
