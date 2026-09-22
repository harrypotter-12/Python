const KEY = 'shelfcut.mystore.v1'

export function loadStore() {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed
      .filter(
        (item) =>
          item &&
          typeof item.id === 'string' &&
          Number.isFinite(Number(item.retail)) &&
          Number(item.retail) >= 0 &&
          Number(item.retail) <= 9999.99,
      )
      .map((item) => ({
        id: item.id,
        retail: roundToCents(Number(item.retail)),
      }))
  } catch {
    return []
  }
}

export function saveStore(items) {
  localStorage.setItem(KEY, JSON.stringify(items))
}

function roundToCents(n) {
  return Math.round((n + Number.EPSILON) * 100) / 100
}
