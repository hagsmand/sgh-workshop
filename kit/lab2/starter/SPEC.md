# Branch Stock Dashboard: spec

Khun Somchai, the Khon Kaen branch manager, opens this page every morning. He wants to see
what needs ordering before the first delivery truck arrives.

## What the page shows

1. A branch picker: Khon Kaen (KKN), Roi Et (ROE), Udon Thani (UDN). Default KKN.
2. Summary tiles: number of products, sold out, low stock, overstock, and stock value at cost in THB.
3. A product table with name (English and Thai), SKU, status badge, on hand, reorder point and days of cover.
4. Filters: status chips (All, Sold out, Low, Overstock, OK) and a search box that works in English and Thai.
5. **Stretch:** a "Suggest reorder" button that lists what to order, how many, and the estimated cost in THB.

## API (Express, JSON)

| Route | Notes |
|-------|-------|
| `GET /api/health` | already done |
| `GET /api/branches` | list of branches |
| `GET /api/stock?branch=&status=&q=` | stock rows, filtered. `status` is one of ok, low, out, over |
| `GET /api/stock/summary?branch=` | counts and stock value at cost |
| `GET /api/reorder?branch=&coverDays=` | stretch. Suggestions. `coverDays` default 14, whole number 0 to 60 |

Bad input returns HTTP 400 with `{ "error": "..." }` that says what is allowed.

## Status rules

Check in this order. The first rule that matches wins.

1. **out**: on hand is 0
2. **low**: on hand is at or below the reorder point
3. **over**: more than 90 days of cover
4. **ok**: everything else

Days of cover = on hand divided by `avgDailySales30d`, rounded to one decimal. If there were no sales, days of cover is empty (null) and the product is never "over".

## Other rules

- `branch` defaults to KKN. Branch codes are case-insensitive.
- `q` matches the SKU, the English name or the Thai name, ignoring case.
- Stock value at cost = sum of `onHand x cost` over all products in the branch.

## Reorder rule (stretch)

`suggested = ceil(avgDailySales30d x (leadTimeDays + coverDays)) - onHand`. Skip rows where this is 0 or less.
Only suggest for products that are out or low. Estimated cost is suggested quantity x cost.

## Data

`data/` has `products.json`, `stock.json`, `branches.json` and `sales.csv`. `src/data.js` has `loadData()`.
Read `data/SCHEMA.md` first.

## Done means

- `npm start` serves the page on http://localhost:3000
- Khon Kaen shows 4 sold-out products
- Every number on the page matches `/api/stock/summary`
- `npm test` passes
