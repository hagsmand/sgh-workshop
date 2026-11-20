// Generates the synthetic Global House dataset used by every lab.
// Deterministic: same seed -> same files on every laptop. No network, no database.
//
//   node scripts/seed.js
//
// Output (kit/data/):
//   branches.json  products.json  stock.json  sales.csv  SCHEMA.md

import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { CATEGORIES, PRODUCTS } from './catalog.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = join(ROOT, 'data');

export const AS_OF = '2026-11-16'; // Monday. Sales cover the 90 days before this date.
const DAYS = 90;
const START = Date.UTC(2026, 7, 18); // 2026-08-18
const SEED = 20261116;

export const BRANCHES = [
  { code: 'KKN', name: 'Global House Khon Kaen', nameTh: 'โกลบอลเฮ้าส์ ขอนแก่น', factor: 1.0 },
  { code: 'ROE', name: 'Global House Roi Et', nameTh: 'โกลบอลเฮ้าส์ ร้อยเอ็ด', factor: 0.7 },
  { code: 'UDN', name: 'Global House Udon Thani', nameTh: 'โกลบอลเฮ้าส์ อุดรธานี', factor: 0.85 },
];

const LEAD_TIME = { CEM: 3, ROF: 7, PLB: 5, ELC: 5, PNT: 4, TIL: 10, TLS: 7, GRD: 5, DEC: 10, DRW: 14 };
const PROMO_CATS = new Set(['TLS', 'PNT', 'DEC', 'GRD']);
const PROMO_FROM = '2026-10-09';
const PROMO_TO = '2026-10-18';

// mulberry32: tiny seeded PRNG
function makeRng(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const rand = makeRng(SEED);
const gauss = () => Math.sqrt(-2 * Math.log(1 - rand())) * Math.cos(2 * Math.PI * rand());
const between = (lo, hi) => lo + (hi - lo) * rand();
const clamp = (x, lo, hi) => Math.min(hi, Math.max(lo, x));
const round2 = (x) => Math.round(x * 100) / 100;

const iso = (ms) => new Date(ms).toISOString().slice(0, 10);

export function buildDataset() {
  // ---- products
  const counters = {};
  const products = PRODUCTS.map((p) => {
    counters[p.cat] = (counters[p.cat] ?? 1000) + 1;
    const cat = CATEGORIES[p.cat];
    return {
      sku: `GH-${p.cat}-${counters[p.cat]}`,
      nameTh: p.th,
      nameEn: p.en,
      category: p.cat,
      categoryEn: cat.en,
      categoryTh: cat.th,
      unit: p.unit,
      price: p.price,
      cost: round2(p.price * (1 - cat.margin)),
    };
  });
  const story = Object.fromEntries(PRODUCTS.map((p, i) => [products[i].sku, p.story]));

  // ---- base daily demand per branch (units/day on an average day)
  const base = {};
  for (const p of products) {
    const skuFactor = clamp(Math.sqrt(200 / p.price), 0.15, 3) * between(0.6, 1.4);
    for (const b of BRANCHES) {
      base[`${b.code}|${p.sku}`] = CATEGORIES[p.category].demand * skuFactor * b.factor;
    }
  }

  // ---- sales
  const sales = []; // { date, branch, sku, qty, unitPrice, revenue }
  const dowFactor = [1.45, 0.9, 0.9, 0.9, 0.95, 1.1, 1.35]; // Sun..Sat
  for (let d = 0; d < DAYS; d++) {
    const ms = START + d * 86400000;
    const date = iso(ms);
    const dt = new Date(ms);
    const dom = dt.getUTCDate();
    const payday = dom >= 25 || dom <= 3 ? 1.15 : 1;
    const promo = date >= PROMO_FROM && date <= PROMO_TO;
    for (const b of BRANCHES) {
      for (const p of products) {
        let lambda = base[`${b.code}|${p.sku}`] * dowFactor[dt.getUTCDay()] * payday;
        if (p.category === 'TIL') lambda *= 1 + 0.004 * d;
        if (p.category === 'ROF') lambda *= 1 - 0.004 * d;
        const onPromo = promo && PROMO_CATS.has(p.category);
        if (onPromo) lambda *= 1.7;
        let qty = Math.max(0, Math.round(lambda + Math.sqrt(lambda) * gauss()));
        // Sold-out items at Khon Kaen: no sales in the last 3 days.
        if (b.code === 'KKN' && story[p.sku] === 'out' && d >= DAYS - 3) qty = 0;
        // One contractor bulk order: planted outlier for the analysis labs.
        if (b.code === 'KKN' && p.sku === 'GH-CEM-1001' && date === '2026-10-24') qty += 420;
        if (qty === 0) continue;
        const unitPrice = onPromo ? Math.round(p.price * 0.9) : p.price;
        sales.push({ date, branch: b.code, sku: p.sku, qty, unitPrice, revenue: qty * unitPrice });
      }
    }
  }

  // ---- 30-day velocity per branch/sku (from the sales we just made)
  const last30From = iso(START + (DAYS - 30) * 86400000);
  const vel = {};
  for (const s of sales) {
    if (s.date >= last30From) vel[`${s.branch}|${s.sku}`] = (vel[`${s.branch}|${s.sku}`] ?? 0) + s.qty;
  }

  // ---- stock
  const stock = [];
  for (const b of BRANCHES) {
    for (const p of products) {
      const key = `${b.code}|${p.sku}`;
      const avgDaily = round2((vel[key] ?? 0) / 30);
      const daily = Math.max(base[key], 0.05);
      const leadTimeDays = LEAD_TIME[p.category];
      const reorderPoint = Math.max(2, Math.ceil(daily * leadTimeDays + daily * 2));
      let onHand = Math.round(reorderPoint + daily * between(5, 20));
      const st = b.code === 'KKN' ? story[p.sku] : undefined;
      if (st === 'out') onHand = 0;
      else if (st === 'low') onHand = Math.max(1, Math.floor(reorderPoint * between(0.3, 0.85)));
      else if (st === 'over') onHand = Math.ceil(daily * between(140, 190));
      else if (b.code !== 'KKN' && rand() < 0.07) onHand = Math.max(0, Math.floor(reorderPoint * between(0.2, 0.9)));
      stock.push({ branch: b.code, sku: p.sku, onHand, reorderPoint, leadTimeDays, avgDailySales30d: avgDaily });
    }
  }

  return { products, sales, stock };
}

function toCsv(rows) {
  const head = 'date,branch,sku,qty,unit_price,revenue';
  return [head, ...rows.map((s) => `${s.date},${s.branch},${s.sku},${s.qty},${s.unitPrice},${s.revenue}`)].join('\n') + '\n';
}

const SCHEMA = `# Dataset schema (synthetic data, not real Global House data)

As of ${AS_OF}. Sales cover 90 days: 2026-08-18 to 2026-11-15. All money is Thai baht (THB).

## branches.json
- code, name, nameTh

## products.json
- sku (GH-<CAT>-<NNNN>), nameTh, nameEn, category, categoryEn, categoryTh, unit, price, cost

## stock.json
- asOf, items[]: branch, sku, onHand, reorderPoint, leadTimeDays, avgDailySales30d

## sales.csv
- date, branch, sku, qty, unit_price, revenue   (revenue = qty x unit_price)
`;

export function writeDataset() {
  const { products, sales, stock } = buildDataset();
  mkdirSync(OUT, { recursive: true });
  writeFileSync(join(OUT, 'branches.json'), JSON.stringify(BRANCHES.map(({ factor, ...b }) => b), null, 2) + '\n');
  writeFileSync(join(OUT, 'products.json'), JSON.stringify(products, null, 2) + '\n');
  writeFileSync(join(OUT, 'stock.json'), JSON.stringify({ asOf: AS_OF, items: stock }, null, 2) + '\n');
  writeFileSync(join(OUT, 'sales.csv'), toCsv(sales));
  writeFileSync(join(OUT, 'SCHEMA.md'), SCHEMA);
  return { products: products.length, stock: stock.length, sales: sales.length };
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const n = writeDataset();
  console.log(`Seeded ${n.products} products, ${n.stock} stock rows, ${n.sales} sales rows -> ${OUT}`);
}
