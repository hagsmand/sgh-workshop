// Global House inventory MCP server (STDIO). Lab 1.
// Gives Bob four read-only tools over the workshop dataset.
//
//   node lab1/mcp/inventory-server.js
//
// IMPORTANT: STDIO servers talk JSON-RPC on stdout. Never console.log() here.
// Use console.error() for debug output.

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { z } from 'zod';
import { daysOfCover, formatBaht, loadData, reorderSuggestions, salesSummary, stockRows } from '../../lib/data.js';

const here = dirname(fileURLToPath(import.meta.url));
const data = loadData(join(here, '..', '..', 'data'));
const BRANCH_CODES = data.branches.map((b) => b.code);

const branchArg = z
  .string()
  .describe(`Branch code. One of: ${BRANCH_CODES.join(', ')} (KKN = Khon Kaen, ROE = Roi Et, UDN = Udon Thani).`);

const text = (value) => ({ content: [{ type: 'text', text: typeof value === 'string' ? value : JSON.stringify(value, null, 2) }] });
const fail = (message) => ({ isError: true, content: [{ type: 'text', text: message }] });
const checkBranch = (code) => (BRANCH_CODES.includes(code) ? null : fail(`Unknown branch "${code}". Use one of: ${BRANCH_CODES.join(', ')}.`));

const server = new McpServer({ name: 'ghh-inventory', version: '1.0.0' });

server.registerTool(
  'get_low_stock',
  {
    title: 'Low and sold-out stock',
    description:
      'Lists products at or below their reorder point (status "low") or with zero stock (status "out") for one Global House branch, as of the dataset date. ' +
      'Use this to answer "what do we need to reorder?" or "what is sold out?". Returns sku, English and Thai name, onHand, reorderPoint and status. Read-only.',
    inputSchema: {
      branch: branchArg,
      includeOutOfStock: z.boolean().default(true).describe('Include products with zero stock. Default true.'),
    },
  },
  async ({ branch, includeOutOfStock }) => {
    const bad = checkBranch(branch);
    if (bad) return bad;
    const rows = stockRows(data, { branch })
      .filter((r) => r.status === 'low' || (includeOutOfStock && r.status === 'out'))
      .sort((a, b) => a.onHand - b.onHand)
      .map((r) => ({ sku: r.sku, nameEn: r.nameEn, nameTh: r.nameTh, onHand: r.onHand, reorderPoint: r.reorderPoint, status: r.status }));
    return text({ asOf: data.asOf, branch, count: rows.length, items: rows });
  },
);

server.registerTool(
  'get_product',
  {
    title: 'Find a product',
    description:
      'Searches products by SKU, English name or Thai name and returns price in THB, unit, category and stock at every branch. ' +
      'Use this when someone asks about a specific product. Read-only.',
    inputSchema: {
      query: z.string().min(1).describe('SKU (for example GH-CEM-1001) or part of an English or Thai product name.'),
    },
  },
  async ({ query }) => {
    const q = query.trim().toLowerCase();
    const found = data.products
      .filter((p) => p.sku.toLowerCase() === q || p.nameEn.toLowerCase().includes(q) || p.nameTh.includes(query.trim()))
      .slice(0, 5)
      .map((p) => ({
        sku: p.sku,
        nameEn: p.nameEn,
        nameTh: p.nameTh,
        category: p.categoryEn,
        unit: p.unit,
        price: formatBaht(p.price),
        stock: data.stock.filter((s) => s.sku === p.sku).map((s) => ({ branch: s.branch, onHand: s.onHand, reorderPoint: s.reorderPoint, daysOfCover: daysOfCover(s) })),
      }));
    return found.length ? text({ asOf: data.asOf, matches: found }) : fail(`No product matches "${query}". Try a shorter name or a SKU.`);
  },
);

server.registerTool(
  'get_sales_summary',
  {
    title: 'Sales summary',
    description:
      'Returns revenue in THB, units sold and the top five products by revenue for a branch over the last N days of the dataset. ' +
      'Optionally filter by category code (CEM, ROF, PLB, ELC, PNT, TIL, TLS, GRD, DEC, DRW). Read-only.',
    inputSchema: {
      branch: branchArg,
      days: z.number().int().min(1).max(90).default(30).describe('Number of days back from the last sales date. 1 to 90. Default 30.'),
      category: z.string().optional().describe('Optional category code, for example PNT for paint.'),
    },
  },
  async ({ branch, days, category }) => {
    const bad = checkBranch(branch);
    if (bad) return bad;
    const s = salesSummary(data, { branch, days, category });
    return text({ ...s, revenue: formatBaht(s.revenue), topProducts: s.topProducts.map((t) => ({ ...t, revenue: formatBaht(t.revenue) })) });
  },
);

server.registerTool(
  'suggest_reorder',
  {
    title: 'Reorder suggestions',
    description:
      'Suggests how many units to order for every low or sold-out product at a branch, using the 30-day sales rate, supplier lead time and a cover window. ' +
      'Returns suggested quantity and estimated cost in THB. Does not place any order. Read-only.',
    inputSchema: {
      branch: branchArg,
      coverDays: z.number().int().min(0).max(60).default(14).describe('Extra days of stock to cover after the lead time. Default 14.'),
    },
  },
  async ({ branch, coverDays }) => {
    const bad = checkBranch(branch);
    if (bad) return bad;
    const rows = reorderSuggestions(data, branch, coverDays);
    const total = rows.reduce((t, r) => t + r.estCost, 0);
    return text({ asOf: data.asOf, branch, coverDays, totalEstimatedCost: formatBaht(total), items: rows });
  },
);

await server.connect(new StdioServerTransport());
console.error('ghh-inventory MCP server ready');
