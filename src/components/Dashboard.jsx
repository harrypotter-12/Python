import { formatMargin, formatMoney, quoteLine } from '../lib/pricing'
import { CutTable } from './CutTable'
import { Ledger } from './Ledger'

export function Dashboard({ summary }) {
  const { count, averageMargin, total, rows } = summary
  const lines = rows.map((row) => ({
    ...quoteLine(row.product, row.retail),
    inStore: true,
  }))

  return (
    <section className="page">
      <header className="page-head">
        <h1>Desk</h1>
        <p>Imports kept in this browser, their average margin, and your cut if each line sells once.</p>
      </header>
      <Ledger
        items={[
          {
            label: 'Imported',
            value: String(count),
            note: 'lines in My Store',
            testId: 'imported-count',
          },
          {
            label: 'Average margin',
            value: formatMargin(averageMargin),
            note: 'across imported lines',
            testId: 'average-margin',
          },
          {
            label: 'Estimated cut',
            value: count === 0 ? '—' : formatMoney(total),
            note: 'one sale of each',
            testId: 'estimated-profit',
            tone: total != null && total < 0 ? 'loss' : undefined,
          },
        ]}
      />
      {count === 0 ? (
        <div className="empty">
          <p>Nothing saved yet. Open the catalog, set an ask price, and add a line.</p>
          <a className="btn" href="#/catalog">
            Open the catalog
          </a>
        </div>
      ) : (
        <>
          <div className="section-row">
            <h2>Saved lines</h2>
            <a href="#/store">Edit ask prices</a>
          </div>
          <CutTable rows={lines} editable={false} />
        </>
      )}
    </section>
  )
}
