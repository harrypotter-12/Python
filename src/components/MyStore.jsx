import { formatMargin, formatMoney, quoteLine } from '../lib/pricing'
import { CutTable } from './CutTable'
import { Ledger } from './Ledger'

export function MyStore({ summary, onAsk, onRemove }) {
  const { rows, count, total, averageMargin } = summary
  const lines = rows.map((row) => ({
    ...quoteLine(row.product, row.retail),
    inStore: true,
  }))

  return (
    <section className="page">
      <header className="page-head">
        <h1>My Store</h1>
        <p>Ask prices stay in this browser after a refresh. Nothing is ordered.</p>
      </header>
      <Ledger
        items={[
          { label: 'Imported', value: String(count), note: 'saved locally' },
          { label: 'Average margin', value: formatMargin(averageMargin), note: 'at your ask prices' },
          {
            label: 'Total estimated cut',
            value: count === 0 ? '—' : formatMoney(total),
            note: 'one sale of each',
            testId: 'store-total',
            tone: total != null && total < 0 ? 'loss' : undefined,
          },
        ]}
      />
      {count === 0 ? (
        <div className="empty">
          <p>No imports yet. Add products from the catalog.</p>
          <a className="btn" href="#/catalog">
            Open the catalog
          </a>
        </div>
      ) : (
        <CutTable rows={lines} editable onAsk={onAsk} onRemove={onRemove} onAdd={() => {}} />
      )}
    </section>
  )
}
