import { useState } from 'react'
import { CATEGORIES } from '../data/products'
import { quoteLine } from '../lib/pricing'
import { CutTable } from './CutTable'

const DAY_OPTIONS = [7, 10, 14, 21]
const MARGIN_OPTIONS = [0, 20, 30, 40, 50, 60]

export function Catalog({ products, retailOf, isInStore, onAsk, onAdd, onRemove }) {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('all')
  const [maxDays, setMaxDays] = useState(21)
  const [minMargin, setMinMargin] = useState(0)
  const [pinned, setPinned] = useState(null)

  const needle = query.trim().toLowerCase()
  const lines = products.map((product) => ({
    ...quoteLine(product, retailOf(product)),
    inStore: isInStore(product.id),
  }))
  const shown = lines.filter((line) => {
    if (line.product.id === pinned) return true
    if (category !== 'all' && line.product.category !== category) return false
    if (line.product.shippingDays > maxDays) return false
    if (line.margin == null || line.margin < minMargin) return false
    if (!needle) return true
    return (
      line.product.title.toLowerCase().includes(needle) ||
      line.product.country.toLowerCase().includes(needle)
    )
  })

  return (
    <section className="page">
      <header className="page-head">
        <h1>Catalog</h1>
        <p>Highest margin first. Type an ask price and your cut updates on that line.</p>
      </header>
      <form className="toolbar" role="search" onSubmit={(event) => event.preventDefault()}>
        <label className="search">
          Search
          <input
            type="search"
            value={query}
            placeholder="Title or country"
            onChange={(event) => setQuery(event.target.value)}
          />
        </label>
        <label>
          Category
          <select value={category} onChange={(event) => setCategory(event.target.value)}>
            <option value="all">All</option>
            {CATEGORIES.map((item) => (
              <option key={item.id} value={item.id}>
                {item.label}
              </option>
            ))}
          </select>
        </label>
        <label>
          Ships within
          <select value={maxDays} onChange={(event) => setMaxDays(Number(event.target.value))}>
            {DAY_OPTIONS.map((days) => (
              <option key={days} value={days}>
                {days === 21 ? '21 days' : `${days} days`}
              </option>
            ))}
          </select>
        </label>
        <label>
          Minimum margin
          <select value={minMargin} onChange={(event) => setMinMargin(Number(event.target.value))}>
            {MARGIN_OPTIONS.map((margin) => (
              <option key={margin} value={margin}>
                {margin}%
              </option>
            ))}
          </select>
        </label>
      </form>
      <p className="count">{shown.length} {shown.length === 1 ? 'product' : 'products'}</p>
      {shown.length === 0 ? (
        <div className="empty">
          <p>No lines match. Raise the shipping window or lower the margin floor.</p>
        </div>
      ) : (
        <CutTable
          rows={shown}
          editable
          onAsk={onAsk}
          onAdd={onAdd}
          onRemove={onRemove}
          onPin={setPinned}
          onUnpin={() => setPinned(null)}
        />
      )}
    </section>
  )
}
