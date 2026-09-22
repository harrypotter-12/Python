import assert from 'node:assert/strict'
import test from 'node:test'
import { marginPercent, profitPerSale } from '../lib/pricing.js'
import { CATEGORIES, products } from './products.js'

const categoryIds = new Set(CATEGORIES.map((category) => category.id))

test('sample catalog covers five categories with 40 products', () => {
  assert.equal(products.length, 40)
  assert.equal(new Set(products.map((product) => product.id)).size, 40)
  for (const category of CATEGORIES) {
    assert.ok(products.some((product) => product.category === category.id))
  }
})

test('every sample product can be priced above its landed cost', () => {
  for (const product of products) {
    assert.ok(categoryIds.has(product.category))
    assert.equal(typeof product.title, 'string')
    assert.ok(product.title.length > 3)
    assert.ok(product.country.length > 1)
    assert.ok(product.productCost > 0)
    assert.ok(product.shippingCost > 0)
    assert.ok(product.shippingDays >= 4 && product.shippingDays <= 21)
    assert.ok(profitPerSale(product.suggestedRetail, product.productCost, product.shippingCost) > 0)
    assert.ok(marginPercent(product.suggestedRetail, product.productCost, product.shippingCost) > 0)
  }
})
