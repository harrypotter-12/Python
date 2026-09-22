import { useState } from 'react'
import { categoryLabel } from '../data/products'
import { formatMargin, formatMoney } from '../lib/pricing'
import { AskField } from './AskField'
import { Swatch } from './Swatch'

export function CutTable({ rows, editable, onAsk, onAdd, onRemove, onPin, onUnpin }) {
  const [dir, setDir] = useState('desc')
  const [frozenIds, setFrozenIds] = useState(null)

  const ordered = orderRows(rows, dir, frozenIds)

  function pin(id) {
    setFrozenIds((current) => current ?? ordered.map((row) => row.product.id))
    onPin?.(id)
  }

  function unpin() {
    setFrozenIds(null)
    onUnpin?.()
  }

  if (!ordered.length) return null

  return (
    <div className={editable ? 'sheet is-editable' : 'sheet'} role="table" aria-label="Products by margin">
      <div className="sheet-head" role="row">
        <button
          type="button"
          className="head-btn"
          onClick={() => setDir((current) => (current === 'desc' ? 'asc' : 'desc'))}
          aria-label={dir === 'desc' ? 'Sorted by margin, highest first' : 'Sorted by margin, lowest first'}
        >
          Margin {dir === 'desc' ? '↓' : '↑'}
        </button>
        <span>Your cut</span>
        <span>Product</span>
        <span>Origin</span>
        <span>Days</span>
        <span title="Product cost plus shipping">Landed cost</span>
        <span>Ask price</span>
        {editable && <span className="sr">Action</span>}
      </div>
      {ordered.map((row) => (
        <div
          className="sheet-row"
          role="row"
          key={row.product.id}
          data-product={row.product.id}
          data-category={row.product.category}
          data-landed={row.landed}
          data-ask={row.ask ?? ''}
          data-cut={row.cut ?? ''}
          data-margin={row.margin ?? ''}
          data-days={row.product.shippingDays}
        >
          <div className="cell margin" role="cell">
            <span className="cell-label">Margin</span>
            <strong>{formatMargin(row.margin)}</strong>
            <span className="track" aria-hidden="true">
              <span
                style={{
                  width: `${row.margin == null ? 0 : Math.max(0, Math.min(row.margin, 100))}%`,
                }}
              />
            </span>
          </div>
          <div className="cell cut" role="cell">
            <span className="cell-label">Your cut</span>
            <strong className={row.cut != null && row.cut < 0 ? 'loss' : 'gain'}>{formatMoney(row.cut)}</strong>
            <span className="per">per sale</span>
          </div>
          <div className="cell product" role="cell">
            <Swatch id={row.product.id} category={row.product.category} />
            <div>
              <span className="cell-label">Product</span>
              <h2>{row.product.title}</h2>
              <p>
                {categoryLabel(row.product.category)}
                {row.inStore && <span className="saved">Saved</span>}
              </p>
            </div>
          </div>
          <div className="cell origin" role="cell">
            <span className="cell-label">Origin</span>
            {row.product.country}
          </div>
          <div className="cell days" role="cell">
            <span className="cell-label">Days</span>
            {row.product.shippingDays}
          </div>
          <div className="cell landed" role="cell">
            <span className="cell-label">Landed cost</span>
            <strong>{formatMoney(row.landed)}</strong>
            <span className="split">
              {formatMoney(row.product.productCost)} + {formatMoney(row.product.shippingCost)} ship
            </span>
          </div>
          <div className="cell ask-cell" role="cell">
            {editable ? (
              <AskField
                id={`ask-${row.product.id}`}
                label={`Ask price for ${row.product.title}`}
                value={row.ask}
                suggested={row.product.suggestedRetail}
                onChange={(ask) => onAsk(row.product.id, ask)}
                onPin={() => pin(row.product.id)}
                onUnpin={unpin}
              />
            ) : (
              <>
                <span className="cell-label">Ask price</span>
                <strong className="mono">{formatMoney(row.ask)}</strong>
              </>
            )}
          </div>
          {editable && (
            <div className="cell action" role="cell">
              {row.inStore ? (
                <button type="button" className="btn ghost" onClick={() => onRemove(row.product.id)}>
                  Remove
                </button>
              ) : (
                <button
                  type="button"
                  className="btn"
                  disabled={row.ask == null || row.ask <= 0}
                  onClick={() => onAdd(row.product.id)}
                >
                  Add to my store
                </button>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

function orderRows(rows, dir, frozenIds) {
  const ranked = [...rows].sort((a, b) => {
    const left = a.margin ?? -Infinity
    const right = b.margin ?? -Infinity
    const diff = dir === 'desc' ? right - left : left - right
    if (diff !== 0) return diff
    return a.product.title.localeCompare(b.product.title)
  })
  if (!frozenIds) return ranked
  const byId = new Map(ranked.map((row) => [row.product.id, row]))
  const kept = frozenIds.map((id) => byId.get(id)).filter(Boolean)
  for (const row of ranked) {
    if (!frozenIds.includes(row.product.id)) kept.push(row)
  }
  return kept
}
