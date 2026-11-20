// Builds the "Monday meeting" files for the Bob Desktop session (lab 4).
// Friendly column names, one row per week/category/branch, small enough for a short session.
//
//   node scripts/monday-pack.js

import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadData, stockRows } from '../lib/data.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = join(ROOT, 'lab4', 'monday-pack');
const data = loadData(join(ROOT, 'data'));
mkdirSync(OUT, { recursive: true });

const q = (v) => (/[",\n]/.test(String(v)) ? `"${String(v).replace(/"/g, '""')}"` : String(v));
const csv = (head, rows) => [head.join(','), ...rows.map((r) => r.map(q).join(','))].join('\n') + '\n';

// Week starts on Monday. Sales begin Tue 2026-08-18, so week 1 is a partial week; label by its Monday.
const monday = (iso) => {
  const d = new Date(iso + 'T00:00:00Z');
  const back = (d.getUTCDay() + 6) % 7;
  return new Date(d.getTime() - back * 86400000).toISOString().slice(0, 10);
};
const branchName = Object.fromEntries(data.branches.map((b) => [b.code, b.name]));

// ---- weekly-sales.csv
const weekly = new Map();
for (const s of data.sales) {
  const p = data.productBySku.get(s.sku);
  const key = `${monday(s.date)}|${s.branch}|${p.category}`;
  const cur = weekly.get(key) ?? { week: monday(s.date), branch: s.branch, category: p.categoryEn, units: 0, revenue: 0 };
  cur.units += s.qty;
  cur.revenue += s.revenue;
  weekly.set(key, cur);
}
const weeklyRows = [...weekly.values()]
  .sort((a, b) => a.week.localeCompare(b.week) || a.branch.localeCompare(b.branch) || a.category.localeCompare(b.category))
  .map((r) => [r.week, branchName[r.branch], r.category, r.units, r.revenue]);
writeFileSync(join(OUT, 'weekly-sales.csv'), csv(['week_starting', 'branch', 'category', 'units_sold', 'revenue_thb'], weeklyRows));

// ---- top-products.csv (last 30 days, per branch)
const lastDate = data.sales.reduce((m, s) => (s.date > m ? s.date : m), '');
const from30 = new Date(Date.parse(lastDate) - 29 * 86400000).toISOString().slice(0, 10);
const bySku = new Map();
for (const s of data.sales.filter((x) => x.date >= from30)) {
  const k = `${s.branch}|${s.sku}`;
  const cur = bySku.get(k) ?? { branch: s.branch, sku: s.sku, units: 0, revenue: 0 };
  cur.units += s.qty;
  cur.revenue += s.revenue;
  bySku.set(k, cur);
}
const topRows = [...bySku.values()]
  .sort((a, b) => a.branch.localeCompare(b.branch) || b.revenue - a.revenue)
  .map((r) => {
    const p = data.productBySku.get(r.sku);
    return [branchName[r.branch], r.sku, p.nameEn, p.nameTh, p.categoryEn, r.units, r.revenue];
  });
writeFileSync(join(OUT, 'top-products-30d.csv'), csv(['branch', 'sku', 'product_en', 'product_th', 'category', 'units_sold', 'revenue_thb'], topRows));

// ---- stock-status.csv
const stockOut = stockRows(data).map((r) => [branchName[r.branch], r.sku, r.nameEn, r.nameTh, r.categoryEn, r.onHand, r.reorderPoint, r.status, r.daysOfCover ?? '', r.avgDailySales30d, r.leadTimeDays, r.cost]);
writeFileSync(join(OUT, 'stock-status.csv'), csv(['branch', 'sku', 'product_en', 'product_th', 'category', 'on_hand', 'reorder_point', 'status', 'days_of_cover', 'avg_daily_sales_30d', 'lead_time_days', 'unit_cost_thb'], stockOut));

// ---- brief.md
writeFileSync(
  join(OUT, 'brief.md'),
  `# Monday sales meeting: brief for Khun Somchai

You are helping the Khon Kaen branch manager prepare for the Monday sales meeting.
Data is as of ${data.asOf}. Sales cover 18 Aug to 15 Nov 2026. Money is Thai baht (THB).

## What the meeting needs

1. **A short slide deck** (6 to 8 slides, English, plain business language) for a room of store managers:
   - how the three branches did over the last 13 weeks
   - the categories that grew and the ones that fell
   - what is sold out or low at Khon Kaen and what to order
   - one clear ask for the meeting
2. **A one-page data report** (a spreadsheet or document) with the numbers behind the slides:
   a table of revenue by branch and category, and the sold-out and low-stock list.

## Files in this folder

| File | What it has |
|------|-------------|
| \`weekly-sales.csv\` | units and revenue by week, branch and category |
| \`top-products-30d.csv\` | each branch's products ranked by revenue, last 30 days |
| \`stock-status.csv\` | stock today: on hand, reorder point, status, days of cover, daily sales, lead time, unit cost |

## Rules

- Reorder rule: suggested quantity = round up (avg_daily_sales_30d x (lead_time_days + 14)) minus on_hand. Only for products that are sold out or low. Cost = quantity x unit_cost_thb.
- Use only these files. Do not invent numbers. If a number is not in the files, say so.
- Show money as ฿1,234.50 or as ฿1.2M for big totals.
- Mark which numbers are for Khon Kaen and which are for all branches.
- Note anything odd you see in the data and say how you handled it.
`,
);

console.log(`Wrote ${weeklyRows.length} weekly rows, ${topRows.length} top-product rows, ${stockOut.length} stock rows -> ${OUT}`);
