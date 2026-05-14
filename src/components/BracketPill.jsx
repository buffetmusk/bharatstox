// Bracket pill — compact label + value cell, used in stat strips.
export function BracketPill({ label, value }) {
  return (
    <div style={{
      flex: 1, borderRadius: 12,
      border: '1px solid var(--hairline)',
      background: 'var(--surface)',
      padding: '8px 12px',
      display: 'flex', flexDirection: 'column',
    }}>
      <span style={{ fontSize: 10, color: 'var(--text-mute)', textTransform: 'uppercase', letterSpacing: 0.5 }}>{label}</span>
      <span className="tnum" style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)', marginTop: 2 }}>{value}</span>
    </div>
  );
}
