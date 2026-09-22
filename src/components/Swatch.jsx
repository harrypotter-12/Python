const INK = {
  home: ['#d7e2ea', '#1f4e79'],
  beauty: ['#f0d9cf', '#8c3d4b'],
  fitness: ['#d5e4dc', '#1f4d45'],
  pets: ['#f3e2c4', '#8a5a22'],
  kitchen: ['#e7dcc8', '#5c4632'],
}

export function Swatch({ id, category }) {
  const [paper, ink] = INK[category] ?? INK.home
  const shift = [...id].reduce((sum, char) => sum + char.charCodeAt(0), 0) % 18

  return (
    <svg className="swatch" viewBox="0 0 48 48" aria-hidden="true">
      <rect width="48" height="48" fill={paper} />
      <rect x={8 + (shift % 6)} y="22" width={28 - (shift % 5)} height="3" fill={ink} />
      <rect x="10" y={12 + (shift % 4)} width="14" height="3" fill={ink} opacity="0.45" />
    </svg>
  )
}
