import { useEffect, useState } from 'react'
import { formatMoney } from '../lib/pricing'

function priceToText(value) {
  if (value == null || Number.isNaN(value)) return ''
  return String(value)
}

export function AskField({ id, label, value, suggested, onChange, onPin, onUnpin }) {
  const [text, setText] = useState(priceToText(value))
  const [focused, setFocused] = useState(false)

  useEffect(() => {
    if (!focused) setText(priceToText(value))
  }, [value, focused])

  function commit(next) {
    setText(next)
    if (next === '' || next === '.') {
      onChange(null)
      return
    }
    const amount = Number(next)
    if (Number.isFinite(amount)) onChange(Math.min(amount, 9999.99))
  }

  const differs = value !== suggested

  return (
    <div
      className="ask"
      onFocus={() => onPin?.()}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) onUnpin?.()
      }}
    >
      <label htmlFor={id}>
        <span className="sr">{label}</span>
        <span className="ask-wrap">
          <span aria-hidden="true">$</span>
          <input
            id={id}
            value={text}
            inputMode="decimal"
            autoComplete="off"
            onFocus={() => setFocused(true)}
            onBlur={() => {
              setFocused(false)
              if (value != null) setText(priceToText(value))
            }}
            onChange={(event) => {
              const next = event.target.value
              if (next === '' || /^\d{0,4}(\.\d{0,2})?$/.test(next)) commit(next)
            }}
          />
        </span>
      </label>
      {differs ? (
        <button type="button" className="suggest" onClick={() => onChange(suggested)}>
          Suggested {formatMoney(suggested)}
        </button>
      ) : (
        <span className="suggest quiet">Suggested {formatMoney(suggested)}</span>
      )}
    </div>
  )
}
