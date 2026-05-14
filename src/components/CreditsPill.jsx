import { useHaptic } from '../hooks/useHaptic';

// Credits chip — pill showing the credit balance.
export function CreditsPill({ value, onClick }) {
  const haptic = useHaptic();
  return (
    <button onClick={(e) => { haptic(); onClick && onClick(e); }} style={{
      height: 30, padding: '0 11px',
      borderRadius: 999,
      border: '1px solid var(--border)',
      background: 'var(--surface)',
      color: 'var(--text)',
      fontFamily: 'inherit', fontSize: 12.5, fontWeight: 600,
      cursor: 'pointer',
      display: 'inline-flex', alignItems: 'center', gap: 6,
    }}>
      <span style={{
        width: 14, height: 14, borderRadius: 999,
        background: 'var(--gold)', color: '#0B0B0C',
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 9, fontWeight: 700,
      }}>◎</span>
      <span className="tnum">{value}</span>
    </button>
  );
}
