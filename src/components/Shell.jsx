const LINKS = [
  { href: '#/', id: '/', label: 'Desk' },
  { href: '#/catalog', id: '/catalog', label: 'Catalog' },
  { href: '#/store', id: '/store', label: 'My Store' },
]

export function Shell({ route, count, children }) {
  return (
    <div className="app">
      <header className="topbar">
        <a className="brand" href="#/">
          Shelfcut
        </a>
        <nav aria-label="Primary">
          {LINKS.map((link) => (
            <a key={link.id} href={link.href} aria-current={route === link.id ? 'page' : undefined}>
              {link.label}
              {link.id === '/store' && <em>{count}</em>}
            </a>
          ))}
        </nav>
        <p className="top-note">Sample sheet</p>
      </header>
      <p className="notice" role="note">
        Sample costs only. Landed cost = product cost + shipping. Your cut = ask price − landed
        cost. Margin = your cut ÷ ask price. These figures are estimates for pricing, not a
        promise of income, and Shelfcut is not a live supplier network.
      </p>
      <div className="main">{children}</div>
    </div>
  )
}
