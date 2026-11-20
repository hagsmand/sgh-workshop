import { test } from 'node:test';
import assert from 'node:assert/strict';
import { priceWithVat, reserve } from '../src/reservations.js';

const stock = () => [{ sku: 'GH-PNT-1001', onHand: 8 }];

test('reserve reduces stock', () => {
  const s = stock();
  assert.equal(reserve(s, 'gh-pnt-1001', 3).onHand, 5);
});

test('reserve refuses to go below zero', () => {
  assert.throws(() => reserve(stock(), 'GH-PNT-1001', 9), /Only 8 in stock/);
});

test('reserve rejects bad quantities and unknown SKUs', () => {
  assert.throws(() => reserve(stock(), 'GH-PNT-1001', 0), /greater than 0/);
  assert.throws(() => reserve(stock(), 'GH-PNT-1001', 1.5), /whole number/);
  assert.throws(() => reserve(stock(), 'GH-XXX-0000', 1), /Unknown SKU/);
});

test('price with VAT is in baht with two decimals', () => {
  assert.equal(priceWithVat(135, 2), '฿288.90');
  assert.equal(priceWithVat(1190, 1), '฿1,273.30');
});
