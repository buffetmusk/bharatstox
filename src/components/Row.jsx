import { useHaptic } from '../hooks/useHaptic';

// Row — list row with optional leading/trailing slots and divider.
export function Row({ left, title, subtitle, right, divider, onClick }) {
  const haptic = useHaptic();
  return (
    <div onClick={onClick ? (e) => { haptic(); onClick(e); } : undefined} style={{
      display: 'flex', alignItems: 'center', gap: 12,
      padding: '14px 16px',
      borderBottom: divider ? '1px solid var(--hairline)' : 'none',
      cursor: onClick ? 'pointer' : 'default',
    }}>
      {left && <div style={{ flexShrink: 0 }}>{left}</div>}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--text)' }}>{title}</div>
        {subtitle && <div style={{ fontSize: 11.5, color: 'var(--text-mute)', marginTop: 1 }}>{subtitle}</div>}
      </div>
      {right && <div style={{ flexShrink: 0 }}>{right}</div>}
    </div>
  );
}
