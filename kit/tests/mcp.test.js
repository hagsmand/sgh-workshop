import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';

const kit = join(dirname(fileURLToPath(import.meta.url)), '..');
let client;

before(async () => {
  client = new Client({ name: 'test', version: '1.0.0' });
  await client.connect(new StdioClientTransport({ command: process.execPath, args: [join(kit, 'lab1/mcp/inventory-server.js')], stderr: 'ignore' }));
});
after(async () => client.close());

const call = async (name, args) => {
  const r = await client.callTool({ name, arguments: args });
  return { isError: !!r.isError, body: r.content[0].text };
};

test('lists four tools', async () => {
  const { tools } = await client.listTools();
  assert.deepEqual(tools.map((t) => t.name).sort(), ['get_low_stock', 'get_product', 'get_sales_summary', 'suggest_reorder']);
  for (const t of tools) assert.ok(t.description.length > 60, `${t.name} needs a real description`);
});

test('get_low_stock KKN finds the planted sold-out items', async () => {
  const r = await call('get_low_stock', { branch: 'KKN' });
  assert.equal(r.isError, false);
  const j = JSON.parse(r.body);
  const out = j.items.filter((i) => i.status === 'out').map((i) => i.sku);
  assert.deepEqual(out.sort(), ['GH-CEM-1001', 'GH-CEM-1005', 'GH-ELC-1004', 'GH-PNT-1006']);
  assert.ok(j.items.filter((i) => i.status === 'low').length >= 6);
});

test('get_low_stock rejects unknown branch with a helpful error', async () => {
  const r = await call('get_low_stock', { branch: 'BKK' });
  assert.equal(r.isError, true);
  assert.match(r.body, /KKN, ROE, UDN/);
});

test('get_product finds by Thai name and by SKU', async () => {
  const th = JSON.parse((await call('get_product', { query: 'ปูนซีเมนต์' })).body);
  assert.equal(th.matches[0].sku, 'GH-CEM-1001');
  assert.match(th.matches[0].price, /^฿135\.00$/);
  const sku = JSON.parse((await call('get_product', { query: 'gh-pnt-1001' })).body);
  assert.equal(sku.matches.length, 1);
  assert.equal(sku.matches[0].stock.length, 3);
});

test('get_product miss is an error, not an empty success', async () => {
  const r = await call('get_product', { query: 'unicorn saddle' });
  assert.equal(r.isError, true);
});

test('get_sales_summary returns THB totals and five top products', async () => {
  const j = JSON.parse((await call('get_sales_summary', { branch: 'KKN', days: 30 })).body);
  assert.match(j.revenue, /^฿[\d,]+\.\d{2}$/);
  assert.equal(j.topProducts.length, 5);
  assert.equal(j.to, '2026-11-15');
});

test('suggest_reorder gives positive quantities for low and out items', async () => {
  const j = JSON.parse((await call('suggest_reorder', { branch: 'KKN' })).body);
  assert.ok(j.items.length >= 10);
  assert.ok(j.items.every((i) => i.suggestedQty > 0));
  assert.match(j.totalEstimatedCost, /^฿/);
});

test('input validation: days out of range is rejected', async () => {
  const r = await client.callTool({ name: 'get_sales_summary', arguments: { branch: 'KKN', days: 500 } }).catch((e) => ({ isError: true, content: [{ text: String(e.message) }] }));
  assert.equal(r.isError, true);
});
