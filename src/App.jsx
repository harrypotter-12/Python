import { useEffect, useMemo, useState } from 'react'
import { Catalog } from './components/Catalog'
import { Dashboard } from './components/Dashboard'
import { MyStore } from './components/MyStore'
import { Shell } from './components/Shell'
import { products } from './data/products'
import { summarizeImports } from './lib/pricing'
import { loadStore, saveStore } from './lib/storage'

const knownIds = new Set(products.map((product) => product.id))

function readRoute() {
  const hash = window.location.hash.replace(/^#/, '') || '/'
  if (hash === '/catalog' || hash === '/store') return hash
  return '/'
}

export default function App() {
  const [route, setRoute] = useState(readRoute)
  const [items, setItems] = useState(() => loadStore().filter((item) => knownIds.has(item.id)))
  const [drafts, setDrafts] = useState({})

  useEffect(() => {
    const onHash = () => setRoute(readRoute())
    window.addEventListener('hashchange', onHash)
    if (!window.location.hash) window.location.hash = '#/'
    return () => window.removeEventListener('hashchange', onHash)
  }, [])

  useEffect(() => {
    saveStore(items)
  }, [items])

  useEffect(() => {
    const titles = {
      '/': 'Desk · Shelfcut',
      '/catalog': 'Catalog · Shelfcut',
      '/store': 'My Store · Shelfcut',
    }
    document.title = titles[route] ?? 'Shelfcut'
  }, [route])

  const summary = useMemo(() => summarizeImports(items, products), [items])

  function retailOf(product) {
    const saved = items.find((item) => item.id === product.id)
    if (saved) return saved.retail
    if (Object.prototype.hasOwnProperty.call(drafts, product.id)) return drafts[product.id]
    return product.suggestedRetail
  }

  function setRetail(id, retail) {
    if (items.some((item) => item.id === id)) {
      if (retail == null) return
      setItems((current) => current.map((item) => (item.id === id ? { ...item, retail } : item)))
      return
    }
    setDrafts((current) => ({ ...current, [id]: retail }))
  }

  function add(id) {
    const product = products.find((item) => item.id === id)
    if (!product) return
    const retail = retailOf(product)
    if (!Number.isFinite(retail) || retail <= 0) return
    setItems((current) => (current.some((item) => item.id === id) ? current : [...current, { id, retail }]))
  }

  function remove(id) {
    const existing = items.find((item) => item.id === id)
    if (existing) setDrafts((current) => ({ ...current, [id]: existing.retail }))
    setItems((current) => current.filter((item) => item.id !== id))
  }

  function isInStore(id) {
    return items.some((item) => item.id === id)
  }

  return (
    <Shell route={route} count={summary.count}>
      {route === '/catalog' && (
        <Catalog
          products={products}
          retailOf={retailOf}
          isInStore={isInStore}
          onAsk={setRetail}
          onAdd={add}
          onRemove={remove}
        />
      )}
      {route === '/store' && <MyStore summary={summary} onAsk={setRetail} onRemove={remove} />}
      {route === '/' && <Dashboard summary={summary} />}
    </Shell>
  )
}
