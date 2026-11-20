// Answer-key numbers, computed from the kit's dataset at build time.
// The HTML pages print these, so what participants are told to expect can never drift from the data.

import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';
import { formatBaht, loadData, reorderSuggestions, salesSummary, stockRows } from '../kit/lib/data.js';

const here = dirname(fileURLToPath(import.meta.url));
const data = loadData(join(here, '..', 'kit', 'data'));

const monday = (iso) => {
  const d = new Date(iso + 'T00:00:00Z');
  return new Date(d.getTime() - ((d.getUTCDay() + 6) % 7) * 86400000).toISOString().slice(0, 10);
};
const baht0 = (n) => '฿' + Math.round(n).toLocaleString('en-US');
const pct = (n) => (n >= 0 ? '+' : '−') + Math.abs(n).toFixed(1) + '%';

export function computeFacts() {
  const kkn = stockRows(data, { branch: 'KKN' });
  const by = (s) => kkn.filter((r) => r.status === s);
  const reorder = reorderSuggestions(data, 'KKN');
  const reorderTotal = reorder.reduce((t, r) => t + r.estCost, 0);

  const cement = ['KKN', 'ROE', 'UDN'].map((b) => ({ branch: b, onHand: data.stock.find((s) => s.branch === b && s.sku === 'GH-CEM-1001').onHand }));

  // weekly revenue
  const week = {};
  const catWeek = {};
  const knnCementWeek = {};
  const branchTotal = { KKN: 0, ROE: 0, UDN: 0 };
  let total = 0;
  const firstDay = {};
  for (const s of data.sales) {
    const w = monday(s.date);
    const p = data.productBySku.get(s.sku);
    week[w] = (week[w] ?? 0) + s.revenue;
    (catWeek[p.categoryEn] ??= {})[w] = ((catWeek[p.categoryEn] ?? {})[w] ?? 0) + s.revenue;
    if (s.branch === 'KKN' && p.category === 'CEM') knnCementWeek[w] = (knnCementWeek[w] ?? 0) + s.revenue;
    branchTotal[s.branch] += s.revenue;
    total += s.revenue;
    firstDay[w] = !firstDay[w] || s.date < firstDay[w] ? s.date : firstDay[w];
  }
  const weeks = Object.keys(week).sort();
  const full = weeks.slice(1); // first week starts Tue 18 Aug: partial
  const first3 = full.slice(0, 3);
  const last3 = full.slice(-3);
  const avg = (m, ws) => ws.reduce((t, w) => t + (m[w] ?? 0), 0) / ws.length;
  const movers = Object.entries(catWeek)
    .map(([cat, m]) => ({ cat, from: avg(m, first3), to: avg(m, last3) }))
    .map((r) => ({ ...r, change: (r.to / r.from - 1) * 100 }))
    .sort((a, b) => b.change - a.change);

  const bySku = {};
  for (const s of data.sales) bySku[s.sku] = (bySku[s.sku] ?? 0) + s.revenue;
  const topSku = Object.entries(bySku).sort((a, b) => b[1] - a[1])[0];

  const cementSpikeWeek = Object.entries(knnCementWeek).sort((a, b) => b[1] - a[1])[0];
  const cementTypical = Object.entries(knnCementWeek).filter(([w]) => w !== cementSpikeWeek[0] && w !== weeks[0]).map(([, v]) => v);
  const cementMedian = cementTypical.sort((a, b) => a - b)[Math.floor(cementTypical.length / 2)];

  const bahtByBranch = Object.fromEntries(Object.entries(branchTotal).map(([k, v]) => [k, v]));
  const stockByBranch = Object.fromEntries(
    ['KKN', 'ROE', 'UDN'].map((b) => {
      const r = stockRows(data, { branch: b });
      return [b, { out: r.filter((x) => x.status === 'out').length, low: r.filter((x) => x.status === 'low').length, over: r.filter((x) => x.status === 'over').length }];
    }),
  );
  const name = (sku) => data.productBySku.get(sku).nameEn;
  const s30 = salesSummary(data, { branch: 'KKN', days: 30 });

  return {
    asOf: data.asOf,
    kkn: {
      skus: kkn.length,
      out: by('out').map((r) => ({ sku: r.sku, nameEn: r.nameEn, nameTh: r.nameTh })),
      low: by('low').map((r) => ({ sku: r.sku, nameEn: r.nameEn, onHand: r.onHand, reorderPoint: r.reorderPoint })),
      over: by('over').map((r) => ({ sku: r.sku, nameEn: r.nameEn })),
      ok: by('ok').length,
      stockValue: kkn.reduce((t, r) => t + r.onHand * r.cost, 0),
      stockValueFmt: formatBaht(Math.round(kkn.reduce((t, r) => t + r.onHand * r.cost, 0) * 100) / 100),
      revenue30: formatBaht(s30.revenue),
    },
    stockByBranch,
    reorder: { count: reorder.length, totalFmt: formatBaht(Math.round(reorderTotal * 100) / 100), top: reorder.slice(0, 3).map((r) => ({ sku: r.sku, nameEn: r.nameEn, qty: r.suggestedQty, unit: r.unit, cost: formatBaht(r.estCost) })) },
    cement,
    thaiSearchPun: stockRows(data, { branch: 'KKN', q: 'ปูน' }).length,
    total: { fmt: baht0(total), exact: formatBaht(total), mFmt: '฿' + (total / 1e6).toFixed(2) + 'M' },
    branch: {
      KKN: { fmt: baht0(bahtByBranch.KKN), mFmt: '฿' + (bahtByBranch.KKN / 1e6).toFixed(2) + 'M' },
      ROE: { fmt: baht0(bahtByBranch.ROE), mFmt: '฿' + (bahtByBranch.ROE / 1e6).toFixed(2) + 'M' },
      UDN: { fmt: baht0(bahtByBranch.UDN), mFmt: '฿' + (bahtByBranch.UDN / 1e6).toFixed(2) + 'M' },
    },
    weeks: weeks.length,
    partialWeek: { monday: weeks[0], firstSalesDate: firstDay[weeks[0]] },
    firstFull: first3,
    lastFull: last3,
    movers: movers.map((m) => ({ cat: m.cat, from: baht0(m.from), to: baht0(m.to), change: pct(m.change) })),
    topGrow: { cat: movers[0].cat, change: pct(movers[0].change) },
    topFall: { cat: movers.at(-1).cat, change: pct(movers.at(-1).change) },
    topSku: { sku: topSku[0], name: name(topSku[0]), revenue: baht0(topSku[1]) },
    cementSpike: { week: cementSpikeWeek[0], revenue: baht0(cementSpikeWeek[1]), typical: baht0(cementMedian) },
    promo: { from: '9 Oct', to: '18 Oct', cats: 'Tools, Paint, Home Decor, Garden' },
  };
}
