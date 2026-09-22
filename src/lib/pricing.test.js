import assert from 'node:assert/strict'
import test from 'node:test'
import {
  formatMargin,
  formatMoney,
  landedCost,
  marginPercent,
  profitPerSale,
  quoteLine,
  summarizeImports,
} from './pricing.js'

test('landed cost is product cost plus shipping', () => {
  assert.equal(landedCost(11.5, 4.25), 15.75)
})

test('your cut is ask price minus landed cost', () => {
  assert.equal(profitPerSale(34, 11.5, 4.25), 18.25)
  assert.equal(profitPerSale(40, 11.5, 4.25), 24.25)
  const line = quoteLine({ productCost: 11.5, shippingCost: 4.25 }, 40)
  assert.equal(line.landed, 15.75)
  assert.equal(line.cut, 24.25)
})

test('margin is profit divided by retail', () => {
  const margin = marginPercent(32, 8.75, 3.4)
  assert.ok(Math.abs(margin - (19.85 / 32) * 100) < 0.001)
})

test('margin is undefined when retail is not positive', () => {
  assert.equal(marginPercent(0, 5, 2), null)
  assert.equal(marginPercent(null, 5, 2), null)
})

test('a price below cost shows a negative profit', () => {
  assert.equal(profitPerSale(10, 8, 4), -2)
})

test('summary totals one sale of each import', () => {
  const catalog = [
    { id: 'a', productCost: 11.5, shippingCost: 4.25 },
    { id: 'b', productCost: 8.75, shippingCost: 3.4 },
  ]
  const summary = summarizeImports(
    [
      { id: 'a', retail: 40 },
      { id: 'b', retail: 32 },
      { id: 'missing', retail: 20 },
    ],
    catalog,
  )
  assert.equal(summary.count, 2)
  assert.equal(summary.total, 44.1)
  assert.ok(Math.abs(summary.averageMargin - ((60.625 + 62.03125) / 2)) < 0.001)
})

test('money and margin format empty values', () => {
  assert.equal(formatMoney(null), '—')
  assert.equal(formatMargin(null), '—')
  assert.equal(formatMoney(18.25), '$18.25')
  assert.equal(formatMargin(62.03125), '62.0%')
})
