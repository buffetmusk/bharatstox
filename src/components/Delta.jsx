import { fmt } from '../data/mockData';

// Delta pill — signed % / absolute change with a direction caret.
export function Delta({ pct, abs, compact = true }) {
  const up = (pct ?? abs) >= 0;
  const color = up ? 'var(--accent)' : 'var(--loss)';
  return (
    <span className="tnum" style={{ color, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
      <span style={{ transform: up ? 'none' : 'rotate(180deg)', display: 'inline-block', fontSize: 10, lineHeight: 1 }}>▲</span>
      {abs !== undefined && <span>₹{fmt.inrCompact(Math.abs(abs))}</span>}
      {pct !== undefined && <span>{pct >= 0 ? '+' : ''}{pct.toFixed(2)}%</span>}
    </span>
  );
}
