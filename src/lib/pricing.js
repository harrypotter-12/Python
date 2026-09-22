export function roundCents(n) {
  return Math.round((n + Number.EPSILON) * 100) / 100
}

export function landedCost(productCost, shippingCost) {
  return roundCents(productCost + shippingCost)
}

export function profitPerSale(retail, productCost, shippingCost) {
  if (!Number.isFinite(retail)) return null
  return roundCents(retail - productCost - shippingCost)
}

export function quoteLine(product, ask) {
  return {
    product,
    ask,
    landed: landedCost(product.productCost, product.shippingCost),
    cut: profitPerSale(ask, product.productCost, product.shippingCost),
    margin: marginPercent(ask, product.productCost, product.shippingCost),
  }
}

export function marginPercent(retail, productCost, shippingCost) {
  if (!Number.isFinite(retail) || retail <= 0) return null
  return ((retail - productCost - shippingCost) / retail) * 100
}

const usd = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
})

export function formatMoney(n) {
  if (n == null || Number.isNaN(n)) return '—'
  return usd.format(roundCents(n))
}

export function formatMargin(pct) {
  if (pct == null || Number.isNaN(pct)) return '—'
  return `${(Math.round(pct * 10) / 10).toFixed(1)}%`
}

export function summarizeImports(items, catalog) {
  const byId = new Map(catalog.map((product) => [product.id, product]))
  const rows = []

  for (const item of items) {
    const product = byId.get(item.id)
    if (!product || !Number.isFinite(item.retail)) continue
    rows.push({
      product,
      retail: item.retail,
      profit: profitPerSale(item.retail, product.productCost, product.shippingCost),
      margin: marginPercent(item.retail, product.productCost, product.shippingCost),
    })
  }

  const profits = rows.map((row) => row.profit).filter((n) => n != null)
  const margins = rows.map((row) => row.margin).filter((n) => n != null)
  const total = profits.length
    ? roundCents(profits.reduce((sum, n) => sum + n, 0))
    : null
  const averageMargin = margins.length
    ? margins.reduce((sum, n) => sum + n, 0) / margins.length
    : null

  return {
    rows,
    count: rows.length,
    total,
    averageMargin,
  }
}
