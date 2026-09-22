export function Ledger({ items }) {
  return (
    <dl className="ledger">
      {items.map((item) => (
        <div key={item.label}>
          <dt>{item.label}</dt>
          <dd data-testid={item.testId} className={item.tone}>
            {item.value}
          </dd>
          {item.note && <small>{item.note}</small>}
        </div>
      ))}
    </dl>
  )
}
